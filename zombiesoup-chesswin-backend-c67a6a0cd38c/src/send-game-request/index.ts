import * as AWS from "aws-sdk";
import * as mysqlL from "mysql";
import { GET_PLAYERS, GET_RANDOM_PLAYER } from "./Queries";
import { Exception } from "./Exceptions";
import { CONSTANTS, UUIDGenerator } from "../_helpers";
const mysql = mysqlL;

const dynamodb = new AWS.DynamoDB();
const lambda = new AWS.Lambda();

let connection;

export const handler = async (event: any = {}): Promise<any> => {
  const userId = event.userId; //this is requester
  let opponentId = event.opponentId;

  console.log("requester", userId, "opponent", opponentId, "event", event);

  if (!connection) {
    initializeConnection();
  }

  try {
    let result: any[];

    result = opponentId
      ? ((await queryPlayers(
          opponentId,
          userId,
          event.type,
          event.points
        )) as any[])
      : ((await queryRandomPlayer(userId, event)) as any[]);

    if (result.length !== 2) {
      return {
        error: Exception.PLAYERS_NOT_AVAILABLE
      };
    }

    let currentUser;
    let opponent;
    for (var e in result) {
      if (result[e].id.trim() !== userId) {
        opponentId = result[e].id.trim();
        opponent = result[e];
        continue;
      }
      currentUser = result[e];
    }

    console.log("result", result);

    const userStatusRes: any = await checkUserStatus({ userId: opponentId });
    console.log("User status result", userStatusRes);
    const userStatus = JSON.parse(userStatusRes.Payload);

    if (!userStatus.online) {
      return {
        error: Exception.PLAYERS_NOT_ONLINE
      };
    }

    const game = {
      id: UUIDGenerator.newGuid(),
      startDate: new Date().getTime(),
      requesterId: userId,
      blackPlayerId: "",
      whitePlayerId: "",
      fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1",
      points: event.points,
      type: event.type, //gold 1 - silver 2
      status: 1, //check Constants file for game statuses
      gameTimeType: event.gameTimeType, //game move time type
      fairPlayEnabled: event.fairPlayEnabled ? 1 : 0,
      promotion: "q",
      rematch: event.rematch
    };

    let random = Math.random() < 0.5;

    game.blackPlayerId = random ? userId : opponentId;
    game.whitePlayerId = random ? opponentId : userId;

    //save game
    await insertGame(game);

    //notify opponent
    const message = {
      type: CONSTANTS.NEW_GAME_REQUEST,
      payload: game,
      user: currentUser
    };

    const sendMessageEvent = {
      message,
      userId: opponentId
    };
    await sendMessage(sendMessageEvent);

    game["opponent"] = opponent;
    return {
      success: true,
      game
    };
  } catch (e) {
    console.log(e);
    return {
      success: false,
      error: Exception.ERROR
    };
  }
};

const initializeConnection = () => {
  connection = mysql.createConnection({
    host: CONSTANTS.CHESSF_MYSQL_HOST,
    user: CONSTANTS.CHESSF_MYSQL_USER,
    password: CONSTANTS.CHESSF_MYSQL_PASSWORD,
    database: CONSTANTS.CHESSF_MYSQL_DATABASE
  });

  //change query format config to use name parameters
  connection.config.queryFormat = function(query, values) {
    if (!values) return query;
    return query.replace(
      /\:(\w+)/g,
      function(txt, key) {
        if (values.hasOwnProperty(key)) {
          return this.escape(values[key]);
        }
        return txt;
      }.bind(this)
    );
  };
};

const insertGame = (game: any) => {
  const params = {
    Item: {
      GameId: {
        S: game.id
      }
    },
    TableName: CONSTANTS.CHESS_GAMES_DYNAMO_TABLE_NAME
  };

  for (var e in game) {
    if (e && e !== "id") {
      params.Item[e] = { S: game[e] + "" };
    }
  }

  return new Promise((resolve, eject) => {
    dynamodb.putItem(
      params,
      (error: AWS.AWSError, data: AWS.DynamoDB.PutItemOutput) => {
        if (error) {
          eject(error);
        } else {
          resolve(data);
        }
      }
    );
  });
};

const sendMessage = (message: any) => {
  return new Promise((resolve, eject) => {
    lambda.invoke(
      {
        FunctionName: "send-messages",
        Payload: JSON.stringify(message),
        InvocationType: "Event"
      },
      (err: AWS.AWSError, data: AWS.Lambda.InvocationResponse) => {
        if (err) {
          eject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
};

const checkUserStatus = (message: any) => {
  return new Promise((resolve, eject) => {
    lambda.invoke(
      {
        FunctionName: "check-user-status",
        Payload: JSON.stringify(message),
        InvocationType: "RequestResponse"
      },
      (err: AWS.AWSError, data: AWS.Lambda.InvocationResponse) => {
        if (err) {
          eject(err);
        } else {
          resolve(data);
        }
      }
    );
  });
};

const queryPlayers = async (
  opponentId: string,
  userId: string,
  type: number,
  points: number
) => {
  console.log("querying players");
  const params = {
    userId,
    opponentId,
    type: type,
    points: points
  };

  return new Promise((resolve, eject) => {
    connection.query(
      GET_PLAYERS,
      params,
      (error: any, results: any, fields: any) => {
        if (error) {
          eject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
};

const queryRandomPlayer = async (userId: string, event: any) => {
  console.log("querying random players");
  const params = {
    id: userId,
    type: event.type,
    points: event.points
  };

  // console.log(
  //   "params(userid, type, points)",
  //   params.id,
  //   params.type,
  //   params.points
  // );

  return new Promise((resolve, eject) => {
    connection.query(
      GET_RANDOM_PLAYER,
      params,
      (error: any, results: any, fields: any) => {
        if (error) {
          eject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
};

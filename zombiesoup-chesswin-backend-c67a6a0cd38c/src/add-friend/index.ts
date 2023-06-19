import * as mysqlL from "mysql";
import * as AWS from "aws-sdk";
import { Exception } from "./Exception";
import { CONSTANTS } from "../_helpers";
import { INSERT_NEW_FRIEND_RECORD } from "./Queries";

const mysql = mysqlL;
const lambda = new AWS.Lambda();

let connection;

export const handler = async (event: any = {}): Promise<any> => {
  if (!connection) {
    initializeConnection();
  }

  const playerId = event.playerId;
  const userId = event.userId;

  console.log("player Id : ", playerId);
  console.log("user Id : ", userId);

  try {
    if (!playerId || !userId) {
      throw new Error();
    }

    await insertNewFriend(playerId, userId);

    //send friend request
    const message = {
      type: CONSTANTS.NEW_FRIEND_REQUEST,
      payload: userId
    };

    const sendMessageEvent = {
      message,
      userId: playerId
    };

    await sendMessage(sendMessageEvent);

    return {
      success: true
    };
  } catch (e) {
    console.log("add-friend-error : ", e);
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

const insertNewFriend = (friendId: any, userId: string) => {
  const params = {
    userId,
    friendId,
    status: 0,
    date: new Date().getTime()
  };

  return new Promise((resolve, eject) => {
    connection.query(INSERT_NEW_FRIEND_RECORD, params, function(
      error,
      results,
      fields
    ) {
      if (error) {
        eject(error);
      } else {
        resolve(results);
      }
    });
  });
};

const sendMessage = (message: any) => {
  return new Promise((resolve, eject) => {
    lambda.invoke(
      {
        FunctionName: "send-messages",
        Payload: JSON.stringify(message),
        InovcationType: "Event"
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

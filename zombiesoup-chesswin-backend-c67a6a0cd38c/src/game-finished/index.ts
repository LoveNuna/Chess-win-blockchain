import * as AWS from 'aws-sdk';
import * as mysqlL from 'mysql';
import { CONSTANTS } from '../_helpers';
import { UPDATE_PLAYER_POINTS, LOAD_GAME_INFOS } from './Queries';
const mysql = mysqlL;
import * as EloRating from 'elo-rating';

const cognito = new AWS.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18'
});
const lambda = new AWS.Lambda();

let connection;

export const handler = async (event: any = {}): Promise<any> => {
  const gameId = event.gameId;

  if (!connection) {
    initializeConnection();
  }

  try {
    //load game infos
    const gameInfos: any = (await loadGameInfos(gameId))[0] as any;

    console.log(
      'Game Id:',
      gameId,
      'Game type:',
      gameInfos.type,
      'Handler on game-finished.'
    );

    const winnerId = gameInfos.winner_id;
    const loserId =
      gameInfos.black_player_id == gameInfos.winner_id
        ? gameInfos.white_player_id
        : gameInfos.black_player_id;

    // look if we can get from DB
    const winnerPoints = await loadUserPoints(winnerId);
    const loserPoints = await loadUserPoints(loserId);

    console.log(
      'Game Id:',
      gameId,
      'Winner points',
      winnerPoints,
      'Looser points',
      loserPoints
    );

    if (gameInfos.type == '1') {
      winnerPoints.goldPoints += parseFloat(
        Number(gameInfos.winner_points).toFixed(2)
      );
      loserPoints.goldPoints -= parseFloat(Number(gameInfos.points).toFixed(2));
    } else {
      // const result = EloRating.calculate(
      //   winnerPoints.silverPoints,
      //   loserPoints.silverPoints,
      //   true
      // );

      winnerPoints.silverPoints += parseFloat(
        Number(gameInfos.winner_points).toFixed(2));
      loserPoints.silverPoints -= parseFloat(
        Number(gameInfos.winner_points).toFixed(2));

      console.log(
        'Winner points : ',
        winnerPoints.silverPoints
      );
      console.log('Loser points : ', loserPoints.silverPoints);
    }

    //update cognito winner
    const cognitoResultWinner = await updateCognitoUser(
      winnerPoints,
      gameInfos.winner_id
    );
    //update cognitor looser
    const cognitoResultLoser = await updateCognitoUser(loserPoints, loserId);

    //update RDS user
    await updateRDSUser(winnerPoints, gameInfos.winner_id);
    await updateRDSUser(loserPoints, loserId);

    //unsubscribe all connections from game
    await notifyUnsubscribeGame(gameId);

    //notify winner to update points
    const message = {
      type: CONSTANTS.POINTS_UPDATED,
      payload: winnerPoints,
      friendship_exists: gameInfos.friendship_exists
    };

    const sendMessageEvent = {
      message,
      userId: gameInfos.winner_id
    };

    await sendMessage(sendMessageEvent);

    //notify loser to update points
    message.payload = loserPoints;
    sendMessageEvent.userId = loserId;
    await sendMessage(sendMessageEvent);
  } catch (e) {
    console.log('Game id: ', gameId, 'Exception: ', e);
    return {
      statusCode: 400
    };
  }

  return {
    statusCode: 200
  };
};

const loadGameInfos = (gameId: string) => {
  const params = {
    gameId
  };

  return new Promise((resolve, eject) => {
    connection.query(LOAD_GAME_INFOS, params, function (error, results, fields) {
      if (error) {
        eject(error);
      } else {
        resolve(results);
      }
    });
  });
};

const loadUserPoints = async (userId: any) => {
  var params = {
    UserPoolId: CONSTANTS.USER_POOL_ID,
    Filter: 'username = "' + userId + '"',
    Limit: 1
  };

  const response: any = await cognito.listUsers(params).promise();
  const user = response.Users[0];

  let goldPoints = 0;
  let silverPoints = 0;

  user.Attributes.forEach((item: any) => {
    if (item.Name === 'custom:gold_points') {
      goldPoints = parseFloat(item.Value);
    } else if (item.Name === 'custom:silver_points') {
      silverPoints = parseFloat(item.Value);
    }
  });

  return {
    goldPoints,
    silverPoints
  };
};

const updateCognitoUser = async (points: any, winnerId: string) => {
  //console.log("Points (before saving to cognito)", points);

  return cognito
    .adminUpdateUserAttributes({
      UserAttributes: [
        {
          Name: 'custom:gold_points',
          Value: '' + parseFloat(points.goldPoints).toFixed(2)
        },
        {
          Name: 'custom:silver_points',
          Value: '' + parseFloat(points.silverPoints).toFixed(2)
        }
      ],
      UserPoolId: CONSTANTS.USER_POOL_ID,
      Username: winnerId
    })
    .promise();
};

export const updateRDSUser = async (points: any, userId: string) => {
  // console.log("Points (before saving to RDS)", points);

  const params = {
    goldPoints: parseFloat(points.goldPoints).toFixed(2),
    silverPoints: parseFloat(points.silverPoints).toFixed(2),
    userId
  };

  return new Promise((resolve, eject) => {
    connection.query(UPDATE_PLAYER_POINTS, params, function (
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

const notifyUnsubscribeGame = (gameId: string) => {
  return new Promise((resolve, eject) => {
    lambda.invoke(
      {
        FunctionName: 'unsubscribe-game',
        Payload: JSON.stringify({ gameId }),
        InvocationType: 'Event'
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

const sendMessage = (message: any) => {
  console.log('Send message in payload ....', message);
  return new Promise((resolve, eject) => {
    lambda.invoke(
      {
        FunctionName: 'send-messages',
        Payload: JSON.stringify(message),
        InvocationType: 'Event'
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

const initializeConnection = () => {
  connection = mysql.createConnection({
    host: CONSTANTS.CHESSF_MYSQL_HOST,
    user: CONSTANTS.CHESSF_MYSQL_USER,
    password: CONSTANTS.CHESSF_MYSQL_PASSWORD,
    database: CONSTANTS.CHESSF_MYSQL_DATABASE
  });

  //change query format config to use name parameters
  connection.config.queryFormat = function (query, values) {
    if (!values) return query;
    return query.replace(
      /\:(\w+)/g,
      function (txt, key) {
        if (values.hasOwnProperty(key)) {
          return this.escape(values[key]);
        }
        return txt;
      }.bind(this)
    );
  };
};

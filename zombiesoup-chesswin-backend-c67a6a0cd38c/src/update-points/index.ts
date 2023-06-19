import * as AWS from 'aws-sdk';
import * as mysqlL from 'mysql';
const mysql = mysqlL;
import { CONSTANTS } from '../_helpers';
import { UPDATE_PLAYER_POINTS, INSERT_GOLD_POINTS_BY } from './Queries';

const cognito = new AWS.CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18'
});
let connection;

export const handler = async (event: any = {}): Promise<any> => {
  const type = event.type;
  const points = event.points;
  const userId = event.userId;
  let source = 'Paypal'; //event.source == 'Merchant' ? event.source : 'Paypal';

  console.log('type', type, 'points', points, 'userId', userId);

  if (!connection) {
    initializeConnection();
  }

  try {
    let cognitoPoints = await loadUserPoints(userId, type);
    console.log('Old user points', cognitoPoints);

    cognitoPoints += parseFloat(points);
    console.log('new user points', cognitoPoints);

    await updateCognitoUser(userId, type, cognitoPoints);
    await updateRDSUser(userId, type, cognitoPoints);
    if (event.payment) {
      await insertIntoGoldPointsBuy(userId, points, source);
    }
  } catch (e) {
    console.log('lambda-error : ', e);
    return { success: false };
  }

  return { success: true };
};

const loadUserPoints = async (userId: any, type: number) => {
  var params = {
    UserPoolId: CONSTANTS.USER_POOL_ID,
    Filter: 'username = "' + userId + '"',
    Limit: 1,
    AttributesToGet: []
  };

  if (type == 1) {
    params.AttributesToGet[0] = 'custom:gold_points';
  } else {
    params.AttributesToGet[0] = 'custom:silver_points';
  }

  const response: any = await cognito.listUsers(params).promise();
  const user = response.Users[0];

  let points = 0;

  console.log(user);

  user.Attributes.forEach((item: any) => {
    if (
      item.Name === 'custom:gold_points' ||
      item.Name === 'custom:silver_points'
    ) {
      points = parseFloat(item.Value);
    }
  });

  return points;
};

const updateCognitoUser = async (
  userId: string,
  type: number,
  points: number
) => {
  const UserAttributes = [
    {
      Name: '',
      Value: '' + points
    }
  ];

  if (type == 1) {
    UserAttributes[0].Name = 'custom:gold_points';
  } else {
    UserAttributes[0].Name = 'custom:silver_points';
  }

  return cognito
    .adminUpdateUserAttributes({
      UserAttributes,
      UserPoolId: CONSTANTS.USER_POOL_ID,
      Username: userId
    })
    .promise();
};

export const updateRDSUser = async (
  userId: string,
  type: number,
  points: number
) => {
  const params = {
    id: userId,
    type,
    points
  };

  return new Promise((resolve, eject) => {
    connection.query(
      UPDATE_PLAYER_POINTS,
      params,
      async (error, results, fields) => {
        if (error) {
          eject(error);
        } else {
          resolve(results);
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

function insertIntoGoldPointsBuy(
  userId: string,
  goldPoints: number,
  source: string
) {
  let transactionDate = new Date().getTime();
  let goldPointsPrice = goldPoints;
  const parameters = {
    userId,
    goldPoints,
    goldPointsPrice,
    transactionDate,
    source
  };

  return new Promise((resolve, reject) => {
    connection.query(
      INSERT_GOLD_POINTS_BY,
      parameters,
      (error, results, fields) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
}

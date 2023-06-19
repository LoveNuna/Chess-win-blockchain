import * as AWS from 'aws-sdk';
import * as mysqlL from 'mysql';
const mysql = mysqlL;
import { CONSTANTS } from '../_helpers';
import { UPDATE_PLAYER_GOLD_POINTS } from './Queries';

const cognito = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' });
let connection;

export const handler = async (event: { userId: string; goldPoints: number }): Promise<any> => {
  if (!connection) {
    initializeConnection();
  }

  try {
    await updateCognitoUser(event.userId, event.goldPoints);
    await updateRDSUser(event.userId, event.goldPoints);
  } catch (e) {
    return { success: false };
  }

  return { success: true };
};

const updateCognitoUser = async (userId: string, goldPoints: number) => {
  const UserAttributes = [
    {
      Name: 'custom:gold_points',
      Value: '' + goldPoints
    }
  ];

  return cognito
    .adminUpdateUserAttributes({
      UserAttributes,
      UserPoolId: CONSTANTS.USER_POOL_ID,
      Username: userId
    })
    .promise();
};

const updateRDSUser = async (userId: string, goldPoints: number) => {
  const params = {
    userId,
    goldPoints
  };

  return new Promise((resolve, eject) => {
    connection.query(UPDATE_PLAYER_GOLD_POINTS, params, (error, results, fields) => {
      if (error) {
        eject(error);
      } else {
        resolve(results);
      }
    });
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

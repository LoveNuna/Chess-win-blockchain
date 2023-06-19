import * as mysqlL from "mysql";
import * as AWS from "aws-sdk";
import { Exception } from "./Exception";
import { SELECT_TRACK_USERS } from "./Queries";
import { CONSTANTS } from "../_helpers";
import { strict } from "assert";
const mysql = mysqlL;

let connection;

export const handler = async (event: any = {}): Promise<any> => {
  if (!connection) {
    initializeConnection();
  }

  try {
    const result = await getTrackUsers(event.numberOfDays);

    return result;
  } catch (e) {
    return {
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
};

const getTrackUsers = async (numberOfDays?: number) => {
  if (numberOfDays == null || numberOfDays < 1) numberOfDays = 7;
  console.log("Number of days", numberOfDays);
  return new Promise((resolve, eject) => {
    connection.query(
      SELECT_TRACK_USERS,
      [numberOfDays],
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

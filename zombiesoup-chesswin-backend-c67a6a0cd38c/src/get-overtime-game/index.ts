import * as mysqlL from "mysql";
import * as AWS from "aws-sdk";
import { Exception } from "./Exception";
import { SELECT_OVERTIME_GAME } from "./Queries";
import { CONSTANTS } from "../_helpers";
const mysql = mysqlL;

let connection;

export const handler = async (event: any = {}): Promise<any> => {
  if (!connection) {
    initializeConnection();
  }

  try {
    const result = await getOverTimeGame();

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

const getOverTimeGame = () => {
  const getOverTimeGame = new Promise((resolve, eject) => {
    connection.query(
      SELECT_OVERTIME_GAME,
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

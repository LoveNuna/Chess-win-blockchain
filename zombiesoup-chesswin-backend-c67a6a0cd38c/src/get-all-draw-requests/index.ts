import * as mysqlL from "mysql";
import { Exception } from "./Exception";
import { SELECT_ALL_DRAW_REQUESTS } from "./Queries";
import { CONSTANTS } from "../_helpers";

const mysql = mysqlL;
let connection;

export const handler = async (event: any = {}): Promise<any> => {
  if (!connection) {
    initializeConnection();
  }

  try {
    const result = await queryFriends();

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

const queryFriends = async () => {
  return new Promise((resolve, eject) => {
    connection.query(SELECT_ALL_DRAW_REQUESTS, 
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

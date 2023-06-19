import * as mysqlL from "mysql";
import { SEARCH_FRIENDS } from "./Queries";
import { CONSTANTS } from "../_helpers";
const mysql = mysqlL;

let connection;

export const handler = async (event: any = {}): Promise<any> => {
  if (!connection) {
    initializeConnection();
  }

  try {
    let result = await queryFriends(event.username);
    return result;
  } catch (e) {
    console.log(e);
    return [];
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

const queryFriends = async (username: string[]) => {
  return new Promise((resolve, eject) => {
    connection.query(
      SEARCH_FRIENDS,
      [username, username],
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

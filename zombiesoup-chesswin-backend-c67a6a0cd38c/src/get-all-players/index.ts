import * as mysqlL from "mysql";
import * as AWS from "aws-sdk";
import { Exception } from "./Exception";
import { SELECT_ALL_PLAYERS, SELECT_ALL_PLAYERS_BY_SEARCH } from "./Queries";
import { CONSTANTS } from "../_helpers";
const mysql = mysqlL;

let connection;

export const handler = async (event: any = {}): Promise<any> => {
  if (!connection) {
    initializeConnection();
  }

  try {
    const result = await queryPlayers(event.start, event.limit, event.filter);

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

function queryPlayers(startNum?: number, limitNum?: number, filter?: string) {
  let query;

  if (filter && filter !== "") {
    query = SELECT_ALL_PLAYERS_BY_SEARCH.replace(/#filter#/g, filter);
  } else {
    query = SELECT_ALL_PLAYERS;
  }

  return new Promise((resolve, eject) => {
    connection.query(
      query,
      [limitNum ? limitNum : 10, startNum ? startNum : 0],
      (error: any, results: any, fields: any) => {
        if (error) {
          eject(error);
        } else {
          resolve({ payload: results });
        }
      }
    );
  });
}

import * as mysqlL from "mysql";
import * as AWS from "aws-sdk";
import { Exception } from "./Exception";
import { SELECT_ALL_GOLD_COINS } from "./Queries";
import { CONSTANTS } from "../_helpers";
import { strict } from "assert";
const mysql = mysqlL;

let connection;

export const handler = async (event: any): Promise<any> => {
  if (!connection) {
    initializeConnection();
  }

  try {
    const result = await queryGetAllGoldCoins(event.weekMonth);

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

var nowDate = new Date();
nowDate.setHours(0);
nowDate.setMinutes(0);
nowDate.setSeconds(0);
nowDate.setMilliseconds(0);

var oneWeekAgo = new Date();
var oneMonthAgo = new Date();

var oneWeekAgoTime = oneWeekAgo.setDate(nowDate.getDate() - 7);
var oneMonthAgoTime = oneMonthAgo.setMonth(nowDate.getMonth() - 1);

const queryGetAllGoldCoins = async (weekMonth: string) => {
  return new Promise((resolve, eject) => {
    let week = "week";
    let getCoin = weekMonth == week ? oneWeekAgoTime : oneMonthAgoTime;
    connection.query(
      SELECT_ALL_GOLD_COINS,
      [getCoin],
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

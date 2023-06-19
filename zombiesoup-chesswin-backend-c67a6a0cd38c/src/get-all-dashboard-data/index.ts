import * as mysqlL from "mysql";
import * as AWS from "aws-sdk";
import { Exception } from "./Exception";
import { SELECT_ALL_DASHBOARD_DATA } from "./Queries";
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

var nowDate = new Date();
nowDate.setHours(0);
nowDate.setMinutes(0);
nowDate.setSeconds(0);
nowDate.setMilliseconds(0);

var oneWeekAgo = new Date();
var oneMonthAgo = new Date();

var nowDateTime = nowDate.getTime();
var oneWeekAgoTime = oneWeekAgo.setDate(nowDate.getDate() - 7);
var oneMonthAgoTime = oneMonthAgo.setMonth(nowDate.getMonth() - 1);

const query = SELECT_ALL_DASHBOARD_DATA.replace(
  /%MONTHTIME%/g,
  oneMonthAgoTime.toString()
)
  .replace(/%WEEKTIME%/g, oneWeekAgoTime.toString())
  .replace(/%DAYTIME%/g, nowDateTime.toString());

const queryFriends = async () => {
  return new Promise((resolve, eject) => {
    connection.query(query, (error: any, results: any, fields: any) => {
      if (error) {
        eject(error);
      } else {
        let [monthly, weekly, daily] = results;

        monthly = {
          ...monthly,
          commissions: Math.round(monthly.commissions * 100) / 100
        };
        weekly = {
          ...weekly,
          commissions: Math.round(weekly.commissions * 100) / 100
        };
        daily = {
          ...daily,
          commissions: Math.round(daily.commissions * 100) / 100
        };

        resolve({ monthlyData: monthly, weeklyData: weekly, dailyData: daily });
      }
    });
  });
};

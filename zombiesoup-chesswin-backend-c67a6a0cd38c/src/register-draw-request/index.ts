import * as mysqlL from "mysql";
import { CONSTANTS } from "../_helpers";
import {INSERT_DRAW_REQUEST } from "./Queries";
import { Exception } from "./Exception";
const mysql = mysqlL;
let connection;

export const handler = async (event: any = {}): Promise<boolean> => {
  if (!connection) {
    initializeConnection();
  }

  try {
    const result = await insertDrawRequest(event.playerId, event.drawGoldPoints, event.paypalEmail);

    return true;
  } catch (e) {
    console.log("Error e :", e);
    return false;
  }
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

function insertDrawRequest(playerId: string, goldPoints: number, paypalEmail:string) {
  let drawStatus = 0;
  let createdDate = new Date().getTime();
  let drawChangeDate = new Date().getTime();
  let drawGoldPoints = goldPoints.toFixed(2);
  const parameters = {
    playerId,
    drawGoldPoints,
    drawStatus,
    paypalEmail,
    createdDate,
    drawChangeDate
  };

  return new Promise((resolve, reject) => {
    connection.query(
      INSERT_DRAW_REQUEST,
      parameters,
      (error, results, fields) => {
        if (error) {
          console.log("Error:", error);
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
}
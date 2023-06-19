import * as mysqlL from "mysql";
import { Exception } from "./Exception";
import { CONSTANTS } from "../_helpers";
import { DELETE_FRIEND_RECORD } from "./Queries";

const mysql = mysqlL;

let connection;

export const handler = async (event: any = {}): Promise<any> => {
  if (!connection) {
    initializeConnection();
  }

  const userId = event.userId;
  const friendId = event.friendId;

  console.log("User Id", userId, "Friend Id", friendId);

  try {
    if (!userId || !friendId) {
      throw new Error();
    }

    await removeFriend(userId, friendId);

    return {
      success: true
    };
  } catch (e) {
    console.log("remove-friend-error", e);
    return {
      success: false,
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

const removeFriend = (friendId: any, userId: string) => {
  const params = {
    userId,
    friendId
  };

  return new Promise((resolve, eject) => {
    connection.query(DELETE_FRIEND_RECORD, params, function(error, results) {
      if (error) {
        eject(error);
      } else {
        resolve(results);
      }
    });
  });
};

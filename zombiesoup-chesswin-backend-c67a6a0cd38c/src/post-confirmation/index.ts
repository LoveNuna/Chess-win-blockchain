import * as AWS from "aws-sdk";
import * as mysqlL from "mysql";
import { INSERT_OR_UPDATE_PLAYER } from "./Queries";
import { CONSTANTS } from "../_helpers";
const cognito = new AWS.CognitoIdentityServiceProvider({
  apiVersion: "2016-04-18"
});
const mysql = mysqlL;

let connection;

export const handler = async (event: any = {}): Promise<any> => {
  if (
    event.triggerSource !== CONSTANTS.POST_CONFIRM_SIGNUP &&
    event.triggerSource !== CONSTANTS.APP_UPDATE_USER
  ) {
    return event;
  }

  if (!connection) {
    initializeConnection();
  }

  let user;

  console.log("getting user");
  if (event.userId) {
    user = await loadUserInfos(event.userId);
    console.log("user 1", user);
  } else {
    user = event.request.userAttributes;
    console.log("user 2", user);
  }

  user.profile_picture = user["custom:profile_picture"];
  user.gold_points = user["custom:gold_points"] || 0;
  user.silver_points = user["custom:silver_points"] || 0;
  user.country = user["custom:country"];
  user.allow_random = user["custom:allow_random"];
  user.status = 0;
  user.playing = 0;

  try {
    await insertOrUpdateUser(user);
  } catch (e) {
    console.log(e);
    return {
      success: false
    };
  }

  if (event.userId) {
    return {
      success: true
    };
  }

  return event;
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

const insertOrUpdateUser = async (user: any) => {
  const params = {
    id: user.sub,
    name: user.name,
    profile_picture: user.profile_picture,
    preferred_username: user.preferred_username,
    email: user.email,
    status: user.status,
    playing: user.playing,
    gold_points: user.gold_points,
    silver_points: user.silver_points,
    country: user.country,
    allow_random: user.allow_random,
    created_date: new Date().getTime()
  };

  return new Promise((resolve, eject) => {
    connection.query(INSERT_OR_UPDATE_PLAYER, params, function(
      error,
      results,
      fields
    ) {
      if (error) {
        eject(error);
      } else {
        resolve(results);
      }
    });
  });
};

const loadUserInfos = async (userId: any) => {
  var params = {
    UserPoolId: CONSTANTS.USER_POOL_ID,
    Filter: 'sub = "' + userId + '"',
    Limit: 1
  };

  const response: any = await cognito.listUsers(params).promise();
  let user = {};

  response.Users[0].Attributes.forEach(element => {
    user[element.Name] = element.Value;
  });

  return user;
};

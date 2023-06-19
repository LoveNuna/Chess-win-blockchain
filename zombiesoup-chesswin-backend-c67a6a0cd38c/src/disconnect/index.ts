import * as mysqlL from "mysql";
import * as AWS from "aws-sdk";
import { UPDATE_PLAYER_STATUS_OFF } from "./Queries";
import { CONSTANTS } from "../_helpers";
const mysql = mysqlL;

const dynamodb = new AWS.DynamoDB();

let connection;

export const handler = async (event: any = {}): Promise<any> => {
  try {
    const result = (await deleteConnection(
      event.requestContext.connectionId
    )) as any;
    if (!result) {
      return {
        statusCode: 200
      };
    }

    const connectionsLeft: any = await countConnectionsLeft(result.PlayerId.S);

    if (!connectionsLeft.Count) {
      if (!connection) {
        initializeConnection();
      }
      console.log(
        "Connection left:",
        connectionsLeft,
        "Player",
        result.PlayerId
      );
      await updateUserStatus(result.PlayerId.S);
    }
  } catch (e) {
    console.log(e);
    return {
      statusCode: 400
    };
  }

  return {
    statusCode: 200
  };
};

const initializeConnection = () => {
  connection = mysql.createConnection({
    host: CONSTANTS.CHESSF_MYSQL_HOST,
    user: CONSTANTS.CHESSF_MYSQL_USER,
    password: CONSTANTS.CHESSF_MYSQL_PASSWORD,
    database: CONSTANTS.CHESSF_MYSQL_DATABASE
  });
};

const deleteConnection = (connectionId: string) => {
  const params = {
    Key: {
      ConnectionId: {
        S: connectionId
      }
    },
    TableName: CONSTANTS.CONNECTED_FRIENDS_TABLE_NAME,
    ReturnValues: "ALL_OLD"
  };

  return new Promise((resolve, eject) => {
    dynamodb.deleteItem(
      params,
      (error: AWS.AWSError, data: AWS.DynamoDB.DeleteItemOutput) => {
        if (error) {
          eject(error);
        } else {
          resolve(data.Attributes);
        }
      }
    );
  });
};

const updateUserStatus = async (userId: any) => {
  const params = [userId];

  return new Promise((resolve, eject) => {
    connection.query(UPDATE_PLAYER_STATUS_OFF, params, function(
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

const countConnectionsLeft = (userId: string) => {
  const params = {
    TableName: CONSTANTS.CONNECTED_FRIENDS_TABLE_NAME,
    IndexName: "PlayerId-index",
    KeyConditionExpression: "PlayerId=:id",
    ExpressionAttributeValues: {
      ":id": {
        S: userId
      }
    },
    Select: "COUNT"
  };

  return new Promise((resolve, eject) => {
    dynamodb.query(
      params,
      (error: AWS.AWSError, data: AWS.DynamoDB.PutItemOutput) => {
        if (error) {
          eject(error);
        } else {
          resolve(data);
        }
      }
    );
  });
};

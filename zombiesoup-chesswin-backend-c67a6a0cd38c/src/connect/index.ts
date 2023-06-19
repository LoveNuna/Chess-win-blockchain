import * as mysqlL from 'mysql';
import * as AWS from 'aws-sdk';
import { UPDATE_PLAYER_STATUS_ON } from './Queries';
import { CONSTANTS } from '../_helpers';
const mysql = mysqlL;

const dynamodb = new AWS.DynamoDB();
const lambda = new AWS.Lambda();

let connection;


export const handler = async (event: any = {}): Promise<any> => {
    const userId = event.queryStringParameters.userId;

    if (!userId) {
        console.log('no user id found rejecting this connection');
        return {
            statusCode: 400
        }
    }

    if (!connection) {
        initializeConnection();
    }

    try {
        console.log(userId, new Date().getTime(), 'updating user status');
        await updateUserStatus(userId);
        await insertConnection(userId, event.requestContext.connectionId);


        //send immediately back connectionId to user
        const message = {
            type: CONSTANTS.CONNECTION_ID,
            payload: event.requestContext.connectionId
        };

        const sendMessageEvent = {
            message,
            connectionId: event.requestContext.connectionId
        }

        console.log(userId, new Date().getTime(), 'sending back to user connectionId');
        await sendMessage(sendMessageEvent);


    } catch (e) {
        console.log(e);
        return {
            statusCode: 400
        }
    }


    return {
        statusCode: 200
    };
}


const initializeConnection = () => {
    connection = mysql.createConnection({
        host: CONSTANTS.CHESSF_MYSQL_HOST,
        user: CONSTANTS.CHESSF_MYSQL_USER,
        password: CONSTANTS.CHESSF_MYSQL_PASSWORD,
        database: CONSTANTS.CHESSF_MYSQL_DATABASE
    });
}


const sendMessage = (message: any) => {
    return new Promise((resolve, eject) => {
        lambda.invoke({
            FunctionName: 'send-messages',
            Payload: JSON.stringify(message),
            InvocationType: 'Event'
        }, (err: AWS.AWSError, data: AWS.Lambda.InvocationResponse) => {
            if (err) {
                eject(err);
            } else {
                resolve(data);
            }
        });
    })
}


const updateUserStatus = async (userId: any) => {
    const params = [userId]

    return new Promise((resolve, eject) => {
        connection.query(UPDATE_PLAYER_STATUS_ON, params, function (error, results, fields) {
            if (error) {
                console.log(userId, new Date().getTime(), 'Error on updating user status');

                eject(error);
            }
            else {
                console.log(userId, new Date().getTime(), 'returning user status');

                resolve(results)
            }
        });
    });
}

const insertConnection = (userId: string, connectionId: string) => {

    const params =
    {
        Item: {
            "ConnectionId": {
                S: connectionId
            },
            "PlayerId": {
                S: userId
            }
        },
        TableName: CONSTANTS.CONNECTED_FRIENDS_TABLE_NAME
    }

    return new Promise((resolve, eject) => {
        dynamodb.putItem(params, (error: AWS.AWSError, data: AWS.DynamoDB.PutItemOutput) => {
            if (error) {
                eject(error)
            } else {
                resolve(data)
            }
        })
    });
}
import { CONSTANTS } from '../_helpers'
import * as AWS from 'aws-sdk';
import { Exception } from './Exceptions';
import { makeRequest } from './HttpUtils';

const dynamodb = new AWS.DynamoDB();


export const handler = async (event: any = {}): Promise<any> => {

    const message = event.message;
    const userId = event.userId;
    const connectionId = event.connectionId;
    const gameId = event.gameId;

    console.log('##Message : ', event.message);

    console.log('recieving-event : ', event);

    try {

        if (connectionId) {
            console.log('sending message to connection direct')
            await sendMessage(message, connectionId);
            return;
        }
        else if (gameId) {
            console.log('sending message to game subscriptions')
            const connectionIds: any = await getGameSubscriptions(gameId);

            for (var e in connectionIds.Items) {
                await sendMessage(message, connectionIds.Items[e].ConnectionId.S);
            }
        }
        else {
            console.log('sending message to user connections')
            const connectionIds: any = await getUserConnectionIds(userId);

            for (var e in connectionIds.Items) {
                await sendMessage(message, connectionIds.Items[e].ConnectionId.S);
            }

        }
        return {
            success: true
        }

    } catch (e) {
        console.log('lambda-error : ', e);
        return {
            success: false,
            error: Exception.ERROR
        };
    }

}


const sendMessage = async (message: any, connectionId: string) => {
    try {
        await makeRequest(message, connectionId);
    } catch (e) {
        if (e.statusCode === 410) {
            console.log('Delete Connection From DynamoDB');
        } else {
            console.log('axios-error : ', e);
        }
    }
}


const getGameSubscriptions = (gameId: string) => {
    const params =
    {
        TableName: CONSTANTS.GAME_SUBSCRIPTIONS_TABLE_NAME,
        ProjectionExpression: "ConnectionId",
        KeyConditionExpression: "GameId=:id",
        ExpressionAttributeValues: {
            ":id": {
                S: gameId
            }
        }
    }

    return new Promise((resolve, eject) => {
        dynamodb.query(params, (error: AWS.AWSError, data: AWS.DynamoDB.PutItemOutput) => {
            if (error) {
                eject(error)
            } else {
                resolve(data)
            }
        })
    });
}


const getUserConnectionIds = (userId: string) => {
    const params =
    {
        TableName: CONSTANTS.CONNECTED_FRIENDS_TABLE_NAME,
        IndexName: 'PlayerId-index',
        ProjectionExpression: "ConnectionId",
        KeyConditionExpression: "PlayerId=:id",
        ExpressionAttributeValues: {
            ":id": {
                S: userId
            }
        }
    }

    return new Promise((resolve, eject) => {
        dynamodb.query(params, (error: AWS.AWSError, data: AWS.DynamoDB.PutItemOutput) => {
            if (error) {
                eject(error)
            } else {
                resolve(data)
            }
        })
    });
}
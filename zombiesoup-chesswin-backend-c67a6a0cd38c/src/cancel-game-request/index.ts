import * as AWS from 'aws-sdk';
import { CONSTANTS } from '../_helpers';

/* this function is deleting game. 
    delete game record has gameid
*/

const dynamodb = new AWS.DynamoDB();

export const handler = async (event: any = {}): Promise<any> => {

    const gameId = event.gameId;

    try {

        await deleteGameFromDynamoDB(gameId);

        return {
            success: true
        }
    } catch (e) {
        console.log('cancel-lambda-request-error : ', e);
        return {
            success: false
        }
    }
}


const deleteGameFromDynamoDB = (gameId: string) => {

    const params =
    {
        Key: {
            "GameId": {
                S: gameId
            }
        },
        TableName: CONSTANTS.CHESS_GAMES_DYNAMO_TABLE_NAME
    }

    return new Promise((resolve, eject) => {
        dynamodb.deleteItem(params, (error: AWS.AWSError, data: AWS.DynamoDB.PutItemOutput) => {
            if (error) {
                eject(error)
            } else {
                resolve(data)
            }
        })
    });
}

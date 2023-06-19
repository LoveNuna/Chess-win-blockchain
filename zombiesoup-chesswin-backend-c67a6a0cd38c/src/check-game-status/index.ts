import * as AWS from 'aws-sdk';
import { CONSTANTS } from '../_helpers';

/* this function is for checking game status
    In this function, checkout all players(two) joined.
    two players are joined, return true
    even one player isn't joined, return flase.
*/

const dynamodb = new AWS.DynamoDB();

export const handler = async (event: any = {}): Promise<any> => {

    const gameId = event.gameId;
    const userId = event.userId;

    try {

        const gameSubscriptions: any = await getGame(gameId);

        let P1Joined = false;
        let P2Joined = false;

        console.log(userId);
        gameSubscriptions.Items.forEach(item => {
            console.log(item.PlayerId.S);
            if (item.PlayerId.S == userId) {
                P1Joined = true;
            } else {
                P2Joined = true;
            }
        });

        if (P1Joined && P2Joined) {
            return {
                ready: true
            }
        }

    } catch (e) {
        console.log('check-game-status, ', e);
        return {
            ready: false
        }
    }


    return {
        ready: false
    }
}

const getGame = (gameId: string) => {

    const params =
    {
        KeyConditionExpression: "GameId=:gameId",
        ExpressionAttributeValues: {
            ":gameId": {
                S: gameId
            }
        },
        TableName: CONSTANTS.GAME_SUBSCRIPTIONS_TABLE_NAME
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



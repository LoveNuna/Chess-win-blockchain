import * as AWS from 'aws-sdk';
import { CONSTANTS } from '../_helpers';
import * as mysqlL from 'mysql';
const mysql = mysqlL;

let connection;

const dynamodb = new AWS.DynamoDB();

export const handler = async (event: any = {}): Promise<any> => {

    const gameId = event.gameId;
    const connectionId = event.connectionId;

    if (!connection) {
        initializeConnection();
    }

    try {

        if (connectionId) {
            const result = await deleteSubscription(gameId, connectionId) as any;
            console.log(result)
            if (result) {
                await updateUserPlayingStatus(result.PlayerId.S);
            }

        } else {
            //  await deleteAllSubscriptions(gameId);
        }

    } catch (e) {
        console.log('unsubscribe-game-lambda-error', e);
        return {
            statusCode: 400
        }
    }


    return {
        statusCode: 200
    }
}

const deleteSubscription = (gameId: string, connectionId: string) => {
    const params =
    {
        Key: {
            "GameId": {
                S: gameId
            },
            "ConnectionId": {
                S: connectionId
            },
        },
        TableName: CONSTANTS.GAME_SUBSCRIPTIONS_TABLE_NAME,
        ReturnValues: "ALL_OLD"
    }

    return new Promise((resolve, eject) => {
        dynamodb.deleteItem(params, (error: AWS.AWSError, data: AWS.DynamoDB.PutItemOutput) => {
            if (error) {
                eject(error)
            } else {
                resolve(data.Attributes)
            }
        })
    });
}




const updateUserPlayingStatus = async (userId: any) => {
    const params = [userId]
    const UPDATE_PLAYER_PLAYING_STATUS_ON = "UPDATE players p SET p.playing = 0 WHERE p.id = ?"


    return new Promise((resolve, eject) => {
        connection.query(UPDATE_PLAYER_PLAYING_STATUS_ON, params, function (error, results, fields) {
            if (error) {
                console.log(userId, new Date().getTime(), 'Error on updating user playing status');

                eject(error);
            }
            else {
                console.log(userId, new Date().getTime(), 'returning user status');

                resolve(results)
            }
        });
    });
}



const initializeConnection = () => {
    connection = mysql.createConnection({
        host: CONSTANTS.CHESSF_MYSQL_HOST,
        user: CONSTANTS.CHESSF_MYSQL_USER,
        password: CONSTANTS.CHESSF_MYSQL_PASSWORD,
        database: CONSTANTS.CHESSF_MYSQL_DATABASE
    });
}

import * as AWS from 'aws-sdk';
import { CONSTANTS } from '../_helpers';
import { Exception } from './Exceptions';
import * as mysqlL from 'mysql';
import { INSERT_NEW_GAME_RECORD } from './Queries';
const mysql = mysqlL;

let connection;

const dynamodb = new AWS.DynamoDB();
const lambda = new AWS.Lambda();

export const handler = async (event: any = {}): Promise<any> => {
    if (!connection) {
        initializeConnection();
    }


    const gameId = event.gameId;

    try {
        const dynamoDBGame: any = (await getGameFromDynamoDb(gameId) as any).Items[0];
        if (!dynamoDBGame) {
            return {
                success: false
            }
        }


        const game: any = {};

        for (var e in dynamoDBGame) {
            if (!e) continue;

            if (e === 'GameId') {
                game['id'] = dynamoDBGame[e].S;
                continue;
            }

            game[e] = dynamoDBGame[e].S
        }


        const secondDifference = (new Date().getTime() - game.startDate) / 1000;
        console.log('second-difference : ', secondDifference);

        if (secondDifference > 30) {
            return {
                success: false
            }
        }

        console.log('inserting new game');
        await insertGameInRDS(game);


        const message = {
            type: CONSTANTS.GAME_REQUEST_ACCEPTED,
            payload: game.id
        };


        const sendMessageEvent = {
            message,
            userId: game.requesterId
        }

        //send message to requester id connections
        await sendMessage(sendMessageEvent);


    } catch (e) {
        console.log('lambda-error : ', e);
        return {
            success: false,
            error: Exception.ERROR
        }
    }


    return {
        success: true
    }

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



export const insertGameInRDS = (game: any) => {

    const params = {
        "id": game.id,
        "blackPlayerId": game.blackPlayerId,
        "whitePlayerId": game.whitePlayerId,
        "requesterId": game.requesterId,
        "type": game.type,
        "gameTimeType": game.gameTimeType,
        "status": game.status,
        "points": game.points,
        "fairPlayEnabled": game.fairPlayEnabled,
        "startDate": game.startDate,
        "fen": game.fen,
        "promotion": game.promotion
    }

    return new Promise((resolve, eject) => {
        connection.query(INSERT_NEW_GAME_RECORD, params, (error, results, fields) => {
            if (error) {
                eject(error);
            }
            else {
                resolve(results)
            }
        });
    });

}


const getGameFromDynamoDb = (gameId: string) => {

    const params =
    {
        KeyConditionExpression: "GameId=:gameId",
        ExpressionAttributeValues: {
            ":gameId": {
                S: gameId
            }
        },
        TableName: CONSTANTS.CHESS_GAMES_DYNAMO_TABLE_NAME
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



const initializeConnection = () => {
    connection = mysql.createConnection({
        host: CONSTANTS.CHESSF_MYSQL_HOST,
        user: CONSTANTS.CHESSF_MYSQL_USER,
        password: CONSTANTS.CHESSF_MYSQL_PASSWORD,
        database: CONSTANTS.CHESSF_MYSQL_DATABASE
    });

    //change query format config to use name parameters
    connection.config.queryFormat = function (query, values) {
        if (!values) return query;
        return query.replace(/\:(\w+)/g, function (txt, key) {
            if (values.hasOwnProperty(key)) {
                return this.escape(values[key]);
            }
            return txt;
        }.bind(this));
    };

}

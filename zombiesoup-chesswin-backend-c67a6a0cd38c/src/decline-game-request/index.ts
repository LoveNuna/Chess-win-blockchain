import * as AWS from 'aws-sdk';
import { CONSTANTS } from '../_helpers';
import { Exception } from './Exceptions';

const lambda = new AWS.Lambda();

export const handler = async (event: any = {}): Promise<any> => {

    const opponentId = event.opponentId;
    const gameId = event.gameId;

    try {

        const message = {
            type: CONSTANTS.GAME_REQUEST_DECLINED,
            payload: gameId
        };


        const sendMessageEvent = {
            message,
            userId: opponentId
        }

        await sendMessage(sendMessageEvent);

        return {
            success: true
        }

    } catch (e) {
        console.log(e);
        return {
            success: false,
            error: Exception.ERROR
        };
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

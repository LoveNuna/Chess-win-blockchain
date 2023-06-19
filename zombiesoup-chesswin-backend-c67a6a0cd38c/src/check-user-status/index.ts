import { CONSTANTS } from '../_helpers'
import * as AWS from 'aws-sdk';
import { Exception } from './Exceptions';
import { makeRequest } from './HttpUtils';

const dynamodb = new AWS.DynamoDB();

/* This function is for checkout user status
 In this fuction, first we get data using userID from databse.
 And then request user status to "/prod/%40connections/"
 */
export const handler = async (event: any = {}): Promise<any> => {

    const userId = event.userId;
    let failedRequestsCount = 0;

    try {

        console.log('sending message to user connections')
        const connectionIds: any = await getUserConnectionIds(userId);


        for (var e in connectionIds.Items) {
            //make first request and if its online check it again (because sometime api gives us real answer only after second request)
            //otherwise if result is false then is offline
            const result = await sendMessage(connectionIds.Items[e].ConnectionId.S);
            console.log('result 1 ', result);

            if (result) {
                //if second result is false then user is offline
                const result2 = await sendMessage(connectionIds.Items[e].ConnectionId.S);
                console.log('result 2 ', result2);

                if (!result2) {
                    //increase failedRequestCount
                    failedRequestsCount += 1;
                }

            } else {
                //increase failedRequestCount
                failedRequestsCount += 1;
            }

        }

        console.log('fail requests count : ', failedRequestsCount)


        return {
            online: connectionIds.Items.length != failedRequestsCount
        }

    } catch (e) {
        console.log('lambda-error : ', e);
        return {
            online: false,
            error: Exception.ERROR
        };
    }

}


const sendMessage = async (connectionId: string) => {
    try {
        await makeRequest(connectionId);
        return true;
    } catch (e) {
        return false;
    }
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
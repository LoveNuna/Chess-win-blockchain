import ApiGatewayManagementApi = require('aws-sdk/clients/apigatewaymanagementapi');
import { CONSTANTS } from '../_helpers';


const apigwManagementApi = new ApiGatewayManagementApi({
    endpoint: CONSTANTS.WEBSOCKET_HOST + '/prod'
});


export const makeRequest = async (message: string, connectionId: string) => {

    const result = await apigwManagementApi.postToConnection({
        ConnectionId: connectionId,
        Data: JSON.stringify(message)
    }).promise();


}
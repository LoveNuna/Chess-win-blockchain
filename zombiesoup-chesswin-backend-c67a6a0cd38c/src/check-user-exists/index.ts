import * as AWS from 'aws-sdk';
import { CONSTANTS } from '../_helpers';

/* In cognito user pool, check out user.
    Input data includes username and useremail. 
    This function check out using AWS cognito filter service.
    
    checkIfUsernameExist: check out username

    checkIfEmailExist: check out email

    handler : 
        If username doesn't exist, return string "preferred_username",
        If email doesn't exist, return string "email"
 */
const cognito = new AWS.CognitoIdentityServiceProvider({ apiVersion: '2016-04-18' })

const UserPoolId = CONSTANTS.USER_POOL_ID;

export const handler = async (event: any = {}): Promise<any> => {


    const usernameExist = await checkIfUsernameExist(event);
    if (usernameExist) {
        return prepareResponse('preferred_username')
    }

    const emailExist = await checkIfEmailExist(event);
    if (emailExist) {
        return prepareResponse('email')
    }

    return prepareResponse('')
}


const checkIfUsernameExist = async (event: any) => {
    var params = {
        UserPoolId,
        Filter: 'preferred_username = "' + event.preferred_username + '"',
        Limit: 1
    };

    const response = await cognito.listUsers(params).promise();

    if (response.Users.length) {
        return true;
    }

    return false;
}


const checkIfEmailExist = async (event: any) => {
    var params = {
        UserPoolId,
        Filter: 'email = "' + event.email + '"',
        Limit: 1
    };

    const response = await cognito.listUsers(params).promise();

    if (response.Users.length) {
        return true;
    }

    return false;
}

const prepareResponse = (attribute: any) => {
    return {
        attribute
    }
}
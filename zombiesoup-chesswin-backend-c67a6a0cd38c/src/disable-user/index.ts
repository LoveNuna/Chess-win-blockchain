import * as AWS from 'aws-sdk';
import { CONSTANTS } from '../_helpers';

const cognitoAdmin = new AWS.CognitoIdentityServiceProvider({
  region: CONSTANTS.WEBSOCKET_REGION,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: CONSTANTS.IDENTITY_POOL_ID
  })
});

export const handler = async (event: { username: string }): Promise<any> => {
  const params = {
    UserPoolId: CONSTANTS.USER_POOL_ID,
    Username: event.username
  };

  try {
    const result = await disableUser(params);

    return result;
  } catch (error) {
    return { error };
  }
};

function disableUser(params) {
  return new Promise((resolve, reject) => {
    cognitoAdmin.adminDisableUser(params, (error, data) => {
      if (error) {
        reject(error);
      } else {
        resolve(data);
      }
    });
  });
}

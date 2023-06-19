import { Injectable } from '@angular/core';

// aws
import * as AWS from 'aws-sdk';

// constants
import { gameActionTypes } from '../../common/constants/game-action-types';

import { environment } from '../../../environments/environment';

@Injectable()
export class ChatService {
	private lambda = new AWS.Lambda({
		region: environment.cognito.region,
		credentials: new AWS.CognitoIdentityCredentials({
			IdentityPoolId: environment.cognito.identityPoolId,
		}),
	});

	constructor() {
		AWS.config.update({
			region: environment.cognito.region,
			credentials: new AWS.CognitoIdentityCredentials({
				IdentityPoolId: environment.cognito.identityPoolId,
			}),
		});
	}

	sendChatMessageLambda(gameId: string, userId: string, message: string) {
		const pullParams = {
			FunctionName: `game-event:${environment.lambdaAlias}`,
			InvocationType: 'RequestResponse',
			LogType: 'None',
			Payload: JSON.stringify({
				eventType: gameActionTypes.CHAT_MESSAGE,
				gameId,
				userId,
				chatEvent: {
					message,
				},
			}),
		};

		return new Promise((resolve, reject) => {
			this.lambda.invoke(
				pullParams,
				(error: AWS.AWSError, data: AWS.Lambda.InvocationResponse) => {
					if (error) {
						reject(error);
					} else {
						if (data.Payload) {
							const result = JSON.parse(data.Payload.toString());

							if (result.statusCode !== 200) {
								reject('Something went wrong !');
							}

							resolve('');
						} else {
							reject('error');
						}
					}
				}
			);
		});
	}
}

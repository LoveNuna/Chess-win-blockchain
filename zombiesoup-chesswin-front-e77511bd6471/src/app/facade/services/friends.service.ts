import { Injectable } from '@angular/core';

// aws
import * as AWS from 'aws-sdk';

import { environment } from '../../../environments/environment';

@Injectable()
export class FriendsService {
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

	addFriend(userId: string, playerId: string) {
		const pullParams = {
			FunctionName: `add-friend:${environment.lambdaAlias}`,
			InvocationType: 'RequestResponse',
			LogType: 'None',
			Payload: JSON.stringify({
				userId,
				playerId,
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

							if (result.success) {
								resolve(true);
							}
							resolve(false);
						} else {
							resolve(false);
						}
					}
				}
			);
		});
	}

	getFriends(userId: string) {
		const pullParams = {
			FunctionName: `get-friends:${environment.lambdaAlias}`,
			InvocationType: 'RequestResponse',
			LogType: 'None',
			Payload: JSON.stringify({
				userId,
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

							if (result.error) {
								reject('Something went wrong !');
							}

							const acceptedFriends = result.filter(
								(friends) => friends.friend_status === 2
							);

							resolve(acceptedFriends);
						} else {
							resolve([]);
						}
					}
				}
			);
		});
	}

	searchForFriends(username: string) {
		const pullParams = {
			FunctionName: `search-friends:${environment.lambdaAlias}`,
			InvocationType: 'RequestResponse',
			LogType: 'None',
			Payload: JSON.stringify({
				username,
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

							resolve(result);
						} else {
							resolve([]);
						}
					}
				}
			);
		});
	}
}

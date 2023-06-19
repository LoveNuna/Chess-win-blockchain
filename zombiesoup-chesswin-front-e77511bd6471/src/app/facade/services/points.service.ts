import { Injectable } from '@angular/core';

// aws
import * as AWS from 'aws-sdk';

import { environment } from '../../../environments/environment';

@Injectable()
export class PointsService {
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

	addUserPoints(userId: string, points: number, source?: string) {
		const pullParams = {
			FunctionName: `update-points:${environment.lambdaAlias}`,
			InvocationType: 'RequestResponse',
			LogType: 'None',
			Payload: JSON.stringify({
				userId,
				points,
				source,
				type: 1,
				payment: true,
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

	updateUserPoints(userId: string, goldPoints: number) {
		const pullParams = {
			FunctionName: `update-gold-points:${environment.lambdaAlias}`,
			InvocationType: 'RequestResponse',
			LogType: 'None',
			Payload: JSON.stringify({
				userId,
				goldPoints,
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

							reject(false);
						} else {
							reject(false);
						}
					}
				}
			);
		});
	}

	requestWithdrawal(
		playerId: string,
		drawGoldPoints: number,
		paypalEmail: string
	) {
		const pullParams = {
			FunctionName: `register-draw-request`,
			InvocationType: 'RequestResponse',
			LogType: 'None',
			Payload: JSON.stringify({
				playerId,
				drawGoldPoints,
				paypalEmail,
			}),
		};

		return new Promise((resolve, reject) => {
			this.lambda.invoke(
				pullParams,
				(error: AWS.AWSError, data: AWS.Lambda.InvocationResponse) => {
					if (error) {
						console.log("withdraw is failed")
						reject(error);
					} else {
						if (data.Payload) {
							const result = JSON.parse(data.Payload.toString());
							if (result.success) {
								resolve(true);
							}

							reject(result.error || 'Something went wrong');
						} else {
							reject('Something went wrong');
						}
					}
				}
			);
		});
	}
}

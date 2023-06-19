import { Injectable } from '@angular/core';

// aws
import * as AWS from 'aws-sdk';

import { environment } from '../../../environments/environment';

@Injectable({
	providedIn: 'root',
})
export class PaymentService {
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

	merchantPay(
		firstname: string,
		lastname: string,
		address: string,
		city: string,
		state: string,
		zip: string,
		amount: string,
		paymentToken: string,
		playerId: string
	) {
		const pullParams = {
			FunctionName: `payment-integration:${environment.lambdaAlias}`,
			InvocationType: 'RequestResponse',
			LogType: 'None',
			Payload: JSON.stringify({
				firstname,
				lastname,
				address,
				city,
				state,
				zip,
				amount,
				paymentToken,
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

							resolve(result);
						}
					}
				}
			);
		});
	}
}

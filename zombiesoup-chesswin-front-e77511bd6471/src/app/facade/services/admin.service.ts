import { Injectable } from '@angular/core';

// aws
import * as AWS from 'aws-sdk';

// rxjs
import { BehaviorSubject } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable()
export class AdminService {
	adminLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	private lambda = new AWS.Lambda({
		region: environment.cognito.region,
		credentials: new AWS.CognitoIdentityCredentials({
			IdentityPoolId: environment.cognito.identityPoolId,
		}),
	});

	private cognitoAdmin = new AWS.CognitoIdentityServiceProvider({
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

	adminLogin(credentials) {
		localStorage.setItem('credentials', JSON.stringify(credentials));
		this.adminLoggedIn.next(true);
	}

	adminSignout() {
		localStorage.removeItem('credentials');
		this.adminLoggedIn.next(false);
	}

	disableUser(username: string) {
		const pullParams = {
			FunctionName: `disable-user:${environment.lambdaAlias}`,
			InvocationType: 'RequestResponse',
			LogType: 'None',
			Payload: JSON.stringify({ username }),
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
								reject(result);
							}

							resolve(result);
						} else {
							reject('error');
						}
					}
				}
			);
		});
	}

	enableUser(username: string) {
		const pullParams = {
			FunctionName: `enable-user:${environment.lambdaAlias}`,
			InvocationType: 'RequestResponse',
			LogType: 'None',
			Payload: JSON.stringify({ username }),
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
								reject(result);
							}

							resolve(result);
						} else {
							reject('error');
						}
					}
				}
			);
		});
	}

	getDashboardData() {
		const pullParams = {
			FunctionName: `get-all-dashboard-data:${environment.lambdaAlias}`,
			InvocationType: 'RequestResponse',
			LogType: 'None',
			Payload: JSON.stringify({}),
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

							if (result.error && result.error.trim() !== '') {
								reject(result);
							}

							resolve(result);
						} else {
							reject('error');
						}
					}
				}
			);
		});
	}

	getGoldCoinsData() {
		const pullParams = {
			FunctionName: `get-gold-coins-data:${environment.lambdaAlias}`,
			InvocationType: 'RequestResponse',
			LogType: 'None',
			Payload: JSON.stringify({}),
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

							if (result.error && result.error.trim() !== '') {
								reject(result);
							}

							resolve(result);
						} else {
							reject('error');
						}
					}
				}
			);
		});
	}

	getWithdrawalData() {
		const pullParams = {
			FunctionName: `get-withdrawal-data:${environment.lambdaAlias}`,
			InvocationType: 'RequestResponse',
			LogType: 'None',
			Payload: JSON.stringify({}),
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

							if (result.error && result.error.trim() !== '') {
								reject(result);
							}

							resolve(result);
						} else {
							reject('error');
						}
					}
				}
			);
		});
	}

	getUsers(start?: number, limit?: number, filter?: string) {
		const pullParams = {
			FunctionName: `get-all-players:${environment.lambdaAlias}`,
			InvocationType: 'RequestResponse',
			LogType: 'None',
			Payload: JSON.stringify({
				start,
				limit,
				filter,
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

							if (result.error && result.error.trim() !== '') {
								reject(result);
							}

							resolve(result);
						} else {
							reject('error');
						}
					}
				}
			);
		});
	}

	getUser(userId: string) {
		const pullParams = {
			FunctionName: `get-single-player:${environment.lambdaAlias}`,
			InvocationType: 'RequestResponse',
			LogType: 'None',
			Payload: JSON.stringify({ userId }),
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

							if (result.error && result.error.trim() !== '') {
								reject(result);
							}

							resolve(result);
						} else {
							reject('error');
						}
					}
				}
			);
		});
	}

	getUserStats(userId: string) {
		const pullParams = {
			FunctionName: `get-user-history:${environment.lambdaAlias}`,
			InvocationType: 'RequestResponse',
			LogType: 'None',
			Payload: JSON.stringify({ userId }),
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

							if (result.error && result.error.trim() !== '') {
								reject(result);
							}

							resolve(result);
						} else {
							reject('error');
						}
					}
				}
			);
		});
	}

	getUserCognito(username: string) {
		const pullParams = {
			FunctionName: `get-user-cognito:${environment.lambdaAlias}`,
			InvocationType: 'RequestResponse',
			LogType: 'None',
			Payload: JSON.stringify({ username }),
		};

		return new Promise((resolve, reject) => {
			this.lambda.invoke(
				pullParams,
				(error: AWS.AWSError, data: AWS.Lambda.InvocationResponse) => {
					if (error) {
						reject(error);
					} else {
						const result = JSON.parse(data.Payload.toString());

						if (result.error) {
							reject(result);
						}

						resolve(result);
					}
				}
			);
		});
	}

	getTrackedUsers(numberOfDays: number) {
		const pullParams = {
			FunctionName: `get-track-users:${environment.lambdaAlias}`,
			InvocationType: 'RequestResponse',
			LogType: 'None',
			Payload: JSON.stringify({ numberOfDays }),
		};

		return new Promise((resolve, reject) => {
			this.lambda.invoke(
				pullParams,
				(error: AWS.AWSError, data: AWS.Lambda.InvocationResponse) => {
					if (error) {
						reject(error);
					} else {
						const result = JSON.parse(data.Payload.toString());

						if (result.error) {
							reject(result);
						}

						resolve(result);
					}
				}
			);
		});
	}

	getUsersGoldCoins(weekMonth: string) {
		const pullParams = {
			FunctionName: `get-all-gold-points:${environment.lambdaAlias}`,
			InvocationType: 'RequestResponse',
			LogType: 'None',
			Payload: JSON.stringify({ weekMonth }),
		};

		return new Promise((resolve, reject) => {
			this.lambda.invoke(
				pullParams,
				(error: AWS.AWSError, data: AWS.Lambda.InvocationResponse) => {
					if (error) {
						reject(error);
					} else {
						const result = JSON.parse(data.Payload.toString());

						if (result.error) {
							reject(result);
						}

						resolve(result);
					}
				}
			);
		});
	}

	getUsersWithdrawals(weekMonth?: string) {
		const pullParams = {
			FunctionName: `get-all-draw-requests:${environment.lambdaAlias}`,
			InvocationType: 'RequestResponse',
			LogType: 'None',
			Payload: JSON.stringify({ weekMonth }),
		};

		return new Promise((resolve, reject) => {
			this.lambda.invoke(
				pullParams,
				(error: AWS.AWSError, data: AWS.Lambda.InvocationResponse) => {
					if (error) {
						reject(error);
					} else {
						const result = JSON.parse(data.Payload.toString());

						if (result.error) {
							reject(result);
						}

						resolve(result);
					}
				}
			);
		});
	}

	updateUserWithdrawalStatus(
		drawStatus: number,
		playerId: string,
		drawGoldPoints: number
	) {
		const pullParams = {
			FunctionName: `update-draw-status:${environment.lambdaAlias}`,
			InvocationType: 'RequestResponse',
			LogType: 'None',
			Payload: JSON.stringify({ drawStatus, playerId, drawGoldPoints }),
		};

		return new Promise((resolve, reject) => {
			this.lambda.invoke(
				pullParams,
				(error: AWS.AWSError, data: AWS.Lambda.InvocationResponse) => {
					if (error) {
						reject(error);
					} else {
						const result = JSON.parse(data.Payload.toString());

						if (result.error) {
							reject(result.error);
						}

						resolve(result);
					}
				}
			);
		});
	}
}

import { Injectable } from '@angular/core';

// aws
import * as AWS from 'aws-sdk';

// rxjs
import { BehaviorSubject } from 'rxjs';

// constants
import { gameActionTypes } from '../../common/constants/game-action-types';

import { environment } from '../../../environments/environment';

@Injectable()
export class GameService {
	private lambda = new AWS.Lambda({
		region: environment.cognito.region,
		credentials: new AWS.CognitoIdentityCredentials({
			IdentityPoolId: environment.cognito.identityPoolId,
		}),
	});

	game: BehaviorSubject<any> = new BehaviorSubject<any>(null);

	constructor() {
		AWS.config.update({
			region: environment.cognito.region,
			credentials: new AWS.CognitoIdentityCredentials({
				IdentityPoolId: environment.cognito.identityPoolId,
			}),
		});
	}

	abortGameLambda(gameId: string, userId: string) {
		const pullParams = {
			FunctionName: `game-event:${environment.lambdaAlias}`,
			InvocationType: 'RequestResponse',
			LogType: 'None',
			Payload: JSON.stringify({
				eventType: gameActionTypes.GAME_ABORT,
				gameId,
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

	acceptGameRequestLambda(game: any) {
		const pullParams = {
			FunctionName: `accept-game-request:${environment.lambdaAlias}`,
			InvocationType: 'RequestResponse',
			LogType: 'None',
			Payload: JSON.stringify(game),
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

							if (!result.success) {
								reject('Something went wrong !');
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

	cancelNewGameRequest(gameId: string) {
		const pullParams = {
			FunctionName: `cancel-game-request:${environment.lambdaAlias}`,
			InvocationType: 'RequestResponse',
			LogType: 'None',
			Payload: JSON.stringify({ gameId }),
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

							if (!result.success) {
								reject('Something went wrong !');
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

	declineGameRequestLambda(opponentId: string, gameId: string) {
		const pullParams = {
			FunctionName: `decline-game-request:${environment.lambdaAlias}`,
			InvocationType: 'RequestResponse',
			LogType: 'None',
			Payload: JSON.stringify({
				gameId,
				opponentId,
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

							resolve('');
						} else {
							reject('error');
						}
					}
				}
			);
		});
	}

	newGameMoveLambda(gameId: string, userId: string, fen: string, move: any) {
		move.timestampUtc = new Date().valueOf();

		const pullParams = {
			FunctionName: `game-event:${environment.lambdaAlias}`,
			InvocationType: 'RequestResponse',
			LogType: 'None',
			Payload: JSON.stringify({
				eventType: gameActionTypes.GAME_MOVE,
				gameId,
				userId,
				gameEvent: {
					fen,
					move,
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

							if (!result.success) {
								reject('Something went wrong !');
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

	sendDrawRequestLambda(
		gameId: string,
		userId: string,
		playerId: string,
		type: gameActionTypes
	) {
		const pullParams = {
			FunctionName: `game-event:${environment.lambdaAlias}`,
			InvocationType: 'RequestResponse',
			LogType: 'None',
			Payload: JSON.stringify({
				eventType: type,
				gameId,
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

	sendGameRequestLambda(userId: string, opponentId: string, gameOptions: any) {
		const pullParams = {
			FunctionName: `send-game-request:${environment.lambdaAlias}`,
			InvocationType: 'RequestResponse',
			LogType: 'None',
			Payload: JSON.stringify({
				userId,
				opponentId,
				...gameOptions,
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
								reject(result.error);
							}

							resolve(result.game);
						} else {
							reject('error');
						}
					}
				}
			);
		});
	}

	subscribeGameLambda(userId: string, gameId: string, connectionId: string) {
		const pullParams = {
			FunctionName: `subscribe-game:${environment.lambdaAlias}`,
			InvocationType: 'RequestResponse',
			LogType: 'None',
			Payload: JSON.stringify({
				userId,
				gameId,
				connectionId,
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

							resolve(result);
						} else {
							reject('error');
						}
					}
				}
			);
		});
	}

	unsubscribeGameLambda(gameId: string, connectionId: string) {
		const pullParams = {
			FunctionName: `unsubscribe-game:${environment.lambdaAlias}`,
			InvocationType: 'RequestResponse',
			LogType: 'None',
			Payload: JSON.stringify({
				gameId,
				connectionId,
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

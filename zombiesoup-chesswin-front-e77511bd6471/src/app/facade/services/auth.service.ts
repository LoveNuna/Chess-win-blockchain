import { Injectable } from '@angular/core';

// aws cognito
import * as AWS from 'aws-sdk/global';
import { AuthenticationDetails, CognitoUserPool, CognitoUser, CognitoUserSession } from 'amazon-cognito-identity-js';

// rxjs
import { BehaviorSubject, Observable } from 'rxjs';

// interfaces
import { User } from 'src/app/common/models/user';

import { environment } from '../../../environments/environment';

@Injectable()
export class AuthService {
	user: BehaviorSubject<User> = new BehaviorSubject<User>(null);

	private poolData = {
		UserPoolId: environment.cognito.poolId,
		ClientId: environment.cognito.webClientId
	};

	private userPool;

	constructor() {
		this.userPool = new CognitoUserPool(this.poolData);
	}

	async getCurrentUser() {
		const cognitoUser = this.userPool.getCurrentUser();

		return new Promise((resolve, reject) => {
			if (cognitoUser) {
				cognitoUser.getSession((error: any, session: CognitoUserSession) => {
					if (error) {
						this.user.next(null);

						reject(error);
					} else {
						if (session.isValid()) {
							const payload = session.getIdToken().payload;

							this.user.next(payload as User);

							resolve(payload);
						} else {
							cognitoUser.refreshSession(session.getRefreshToken(), (refreshSessionError: any, newSession: CognitoUserSession) => {
								if (refreshSessionError) {
									this.user.next(null);

									reject(refreshSessionError);
								} else {
									const payload = session.getIdToken().payload;

									this.user.next(payload as User);

									resolve(payload);
								}
							});
						}
					}
				});
			} else {
				this.user.next(null);

				resolve(null);
			}
		});
	}

	getAccessToken(): Promise<string> {
		const cognitoUser = this.userPool.getCurrentUser();

		return new Promise((resolve, reject) => {
			if (cognitoUser) {
				cognitoUser.getSession((error, session: CognitoUserSession) => {
					if (error) {
						reject(error);
					}

					const token = session.getAccessToken().getJwtToken();

					resolve(token);
				});
			}
		});
	}

	login(username: string, password: string) {
		const authenticationData = {
			Username: username,
			Password: password
		};

		const authenticationDetails = new AuthenticationDetails(authenticationData);

		const userData = {
			Username: username,
			Pool: this.userPool
		};

		const cognitoUser = new CognitoUser(userData);
		console.log("I am here")
		return new Promise((resolve, reject) => {
			cognitoUser.authenticateUser(authenticationDetails, {
				onSuccess: result => {
					AWS.config.region = environment.cognito.region;

					AWS.config.credentials = new AWS.CognitoIdentityCredentials({
						IdentityPoolId: environment.cognito.identityPoolId,
						Logins: {
							loginUrl: result.getIdToken().getJwtToken()
						}
					});

					const payload = result.getIdToken().payload;

					this.user.next(payload as User);

					resolve(payload);
				},

				onFailure: error => {
					console.log("Here failed")
					reject(error);
				}
			});
		});
	}

	refreshToken(): Observable<string> {
		const cognitoUser = this.userPool.getCurrentUser();

		return new Observable(observer => {
			if (cognitoUser) {
				cognitoUser.getSession((error, session: CognitoUserSession) => {
					if (error) {
						observer.error(error);
					}

					cognitoUser.refreshSession(session.getRefreshToken(), (refreshSessionError: any) => {
						if (refreshSessionError) {
							observer.next('');
						} else {
							const refreshedToken = session.getAccessToken().getJwtToken();

							observer.next(refreshedToken);
						}
					});
				});
			} else {
				observer.next('');
			}
		});
	}

	signOut() {
		const username = this.user.getValue().email;

		const userData = {
			Username: username,
			Pool: this.userPool
		};

		const cognitoUser = new CognitoUser(userData);

		this.user.next(null);

		cognitoUser.signOut();
	}
}

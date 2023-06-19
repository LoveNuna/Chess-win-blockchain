import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { MatDialog } from '@angular/material/dialog';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

// rxjs
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// services
import { FacadeService } from 'facade-service';

// dialogs
import { AbandonGameComponent } from '../../../../common/components/dialogs/abandon-game/abandon-game.component';
import { ChallengeDialogComponent } from '../../components/side-nav/challenge-dialog/challenge-dialog.component';
import { ChallengeReceivedComponent } from '../../../../common/components/dialogs/challenge-received/challenge-received.component';

// constants
import { challengeType } from '../../../../common/constants/challenge-type';
import { messageStatus } from '../../../../common/constants/message-status';

// interfaces
import { User } from '../../../../common/models/user';
import { ChallengeDialogData } from '../../../../common/models/challenge-dialog-data';

// functions
import { getErrorFromCode } from '../../../../common/functions/error-codes';

@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit, OnDestroy {
	user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
	friends: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null);
	game: BehaviorSubject<any> = new BehaviorSubject<any>(null);
	messages: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

	showGameChat = false;
	showMenu = true;
	showChat = true;
	responsiveView = false;

	userId;

	messageStatus;

	lookingForChallenge = false;

	gameData: Map<string, any> = new Map<string, any>();

	destroyed: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

	constructor(
		private dialog: MatDialog,
		private facadeService: FacadeService,
		private router: Router,
		private route: ActivatedRoute,
		private breakpointObserver: BreakpointObserver
	) {}

	async ngOnInit() {
		this.game = this.facadeService.game;

		const cognitoUser = (await this.facadeService.getUserCognito(
			this.facadeService.user.getValue().email
		)) as any;

		let user;

		cognitoUser.UserAttributes.map((item) => {
			user = { ...user, [`${item.Name}`]: item.Value };
		});

		this.facadeService.user.next(user);

		this.facadeService.user
			.pipe(takeUntil(this.destroyed))
			.subscribe((userData) => {
				if (userData) {
					this.user.next(userData);

					this.facadeService
						.getFriends(userData.sub)
						.then((friendsData: any[]) => this.friends.next(friendsData));
				}
			});

		if (this.router.url.includes('game')) {
			this.showGameChat = true;
		} else {
			this.showGameChat = false;
		}

		this.router.events.subscribe((event) => {
			if (event instanceof NavigationEnd) {
				if (this.router.url.includes('game')) {
					this.showGameChat = true;
				} else {
					this.showGameChat = false;
				}
			}
		});

		this.breakpointObserver
			.observe(['(max-width: 1024px)'])
			.subscribe((state: BreakpointState) => {
				if (state.matches) {
					this.showMenu = false;
					this.showChat = false;
					this.responsiveView = true;
				} else {
					this.showMenu = true;
					this.showChat = true;
					this.responsiveView = false;
				}
			});

		this.facadeService.newGameRequest.subscribe((data) => {
			if (data) {
				this.handleGameRequestReceived(data);
			}
		});

		this.facadeService.gameRequestAccepted.subscribe((data) => {
			if (data) {
				this.handleGameRequestAccepted(data);
			}
		});

		this.facadeService.gameRequestDeclined.subscribe((data) => {
			if (data) {
				this.handleGameRequestDeclined(data);
			}
		});

		this.facadeService.chatMessage.subscribe((data) => {
			if (data && data.userId !== this.facadeService.user.getValue().sub) {
				const messageData = { userId: data.userId, message: data.payload };

				const messages = [...this.messages.getValue(), messageData];

				this.messages.next(messages);
			}
		});

		this.facadeService.pointsUpdated.subscribe((data) => {
			if (data) {
				let user = this.facadeService.user.getValue();

				user = {
					...user,
					['custom:silver_points']: data.payload.silverPoints,
					['custom:gold_points']: data.payload.goldPoints,
				};

				this.facadeService.user.next(user);
			}
		});
	}

	ngOnDestroy() {
		this.destroyed.next(true);
		this.destroyed.complete();
	}

	handleNewGameRequest(friend) {
		const challengeDialogData: ChallengeDialogData = {
			userId: this.user.getValue().sub,
			userName: this.user.getValue().name,
			userImage: this.user.getValue()['custom:profile_picture'],
			userCountry: this.user.getValue()['custom:country'],
			challengeType: challengeType.gold,
			opponentCountry: friend.country,
			opponentId: friend.id,
			opponentImage: friend.profile_picture,
			opponentName: friend.name,
			opponentNickname: friend.preferred_username,
		};

		const challengeDialog = this.dialog.open(ChallengeDialogComponent, {
			width: '325px',
			data: challengeDialogData,
			panelClass: 'challenge-dialog',
		});

		challengeDialog.afterClosed().subscribe(async (data) => {
			if (data) {
				this.facadeService.openSimpleSnackbar('Sending challenge...');

				this.facadeService
					.sendGameRequestLambda(data.userId, data.opponentId, {
						userId: data.userId,
						opponentId: data.opponentId,
						points: data.challengeAmmount,
						type: data.challengeType,
						gameTimeType: data.challengeTime,
						fairPlayEnabled: data.fairPlay,
					})
					.then((gameRequestData: any) => {
						this.facadeService.openSnackbarWithDismiss('Challenge sent!', 5000);

						this.gameData.set(gameRequestData.id, {
							...gameRequestData,
							user: this.facadeService.user.getValue(),
						});
					})
					.catch((error) => {
						if (error) {
							const errorMessage = getErrorFromCode(error);
							this.facadeService.openSnackbarWithDismiss(errorMessage, 5000);
						}
					});
			}
		});
	}

	handleRandomGameRequest(gameChallengeType: challengeType) {
		const challengeDialog = this.dialog.open(ChallengeDialogComponent, {
			width: '325px',
			data: {
				challengeType: gameChallengeType,
			},
			panelClass: 'challenge-dialog',
		});

		challengeDialog.afterClosed().subscribe(async (data) => {
			if (data) {
				this.lookingForChallenge = true;

				const findingOpponentSnackbar = this.facadeService.openSnackbarWithAction(
					'Finding an opponent...',
					'Cancel',
					30000
				);

				findingOpponentSnackbar.onAction().subscribe(() => {
					this.facadeService.cancelNewGameReuqest('123');
				});

				// this.facadeService
				//	 .sendGameRequestLambda(this.facadeService.user.getValue().sub, null, {
				//		 userId: this.facadeService.user.getValue().sub,
				//		 opponentId: null,
				//		 points: data.challengeAmmount,
				//		 type: data.challengeType,
				//		 gameTimeType: data.challengeTime,
				//		 fairPlayEnabled: data.fairPlay
				//	 })
				//	 .then((gameRequestData: any) => {
				//		 this.facadeService.openSnackbarWithDismiss('An opponent was found!', 5000);

				//		 this.gameData.set(gameRequestData.id, { ...gameRequestData, user: this.facadeService.user.getValue() });
				//	 })
				//	 .catch(error => {
				//		 if (error) {
				//			 const errorMessage = getErrorFromCode(error);
				//			 this.facadeService.openSnackbarWithDismiss(errorMessage, 5000);
				//		 }
				//	 });
			}
		});
	}

	async handleGameRequestReceived(data: any) {
		if (data) {
			const challengeReceivedDialog = this.dialog.open(
				ChallengeReceivedComponent,
				{
					width: '315px',
					data: {
						opponentImage: data.user.profile_picture,
						opponentCountry: data.user.country,
						opponentName: data.user.name,
						opponentNickname: data.user.preferred_username,
						challengeType: data.payload.type,
						challengeAmmount: data.payload.points,
						challengeTime: data.payload.gameTimeType,
						challengeFairPlay: !!data.payload.fairPlayEnabled,
					},
					panelClass: 'challenge-dialog',
					disableClose: true,
				}
			);

			challengeReceivedDialog.afterClosed().subscribe(async (dialogData) => {
				if (dialogData) {
					this.facadeService.openSnackbarWithDismiss(
						'Accepting challenge...',
						5000
					);

					const gamePayload = { ...data.payload, gameId: data.payload.id };

					await this.facadeService.acceptGameRequestLambda(gamePayload);

					await this.facadeService.subscribeGameLambda(
						this.user.getValue().sub,
						gamePayload.id,
						this.facadeService.connectionId.getValue()
					);

					this.gameData.set(data.payload.id, {
						...data.payload,
						opponent: data.user,
						user: this.facadeService.user.getValue(),
					});

					this.populateGameData(gamePayload.id);

					this.facadeService.openSnackbarWithTimer('Challenge accepted!', 2500);

					if (this.responsiveView) {
						this.showMenu = false;
					}

					this.router.navigate(['/app/game']);
				} else {
					this.facadeService.openSnackbarWithDismiss(
						'Declining challenge...',
						5000
					);

					this.facadeService.declineGameRequestLambda(
						data.user.id,
						data.payload.id
					);

					this.clearGameData(data.payload.id);

					this.facadeService.openSnackbarWithTimer('Challenge declined!', 2500);
				}
			});
		}
	}

	sendMessage(message: string) {
		if (!message || message.trim() === '') {
			return;
		}

		this.messageStatus = messageStatus.sending;

		const messageData = {
			userId: this.facadeService.user.getValue().sub,
			message,
		};

		const messages = [...this.messages.getValue(), messageData];

		this.messages.next(messages);

		this.facadeService
			.sendChatMessageLambda(
				this.game.getValue().id,
				this.facadeService.user.getValue().sub,
				message
			)
			.then((data) => {
				this.messageStatus = messageStatus.sent;
			})
			.catch((error) => {
				this.messageStatus = messageStatus.failed;
			});
	}

	// from webhook
	handleGameRequestAccepted(data: any) {
		this.facadeService.openSnackbarWithTimer('Challenge accepted!', 2500);

		this.populateGameData(data.payload);

		this.facadeService
			.subscribeGameLambda(
				this.user.getValue().sub,
				data.payload,
				this.facadeService.connectionId.getValue()
			)
			.then((subData) => {
				if (this.responsiveView) {
					this.showMenu = false;
				}

				this.router.navigate(['/app/game']);
			});
	}

	handleGameRequestDeclined(data: any) {
		this.facadeService.game.next(null);
		this.facadeService.openSnackbarWithDismiss('Challenge declined!', 5000);
	}

	async signOut() {
		if (this.game.getValue()) {
			const abandonGameDialog = this.dialog.open(AbandonGameComponent, {
				width: '500px',
				panelClass: 'challenge-dialog',
			});

			abandonGameDialog.afterClosed().subscribe(async (data) => {
				if (data) {
					this.facadeService.openSimpleSnackbar('Abandoning game...');

					try {
						await this.facadeService.abortGameLambda(
							this.game.getValue().id,
							this.facadeService.user.getValue().sub
						);

						await this.facadeService.unsubscribeGameLambda(
							this.game.getValue().id,
							this.facadeService.connectionId.getValue()
						);

						this.facadeService.openSnackbarWithDismiss('Game abandoned', 2500);

						this.clearGameData(this.game.getValue().id);
					} catch (error) {
						this.facadeService.openSnackbarWithTimer(
							'An error occurred!',
							2500
						);
					}
				}
			});
		}

		this.facadeService.signOut();
		this.gameData.clear();
		this.router.navigate(['/']);
	}

	private populateGameData(id: string) {
		localStorage.setItem('game', JSON.stringify(this.gameData));
		localStorage.setItem('gameId', this.gameData.get(id));
		this.facadeService.game.next(this.gameData.get(id));
	}

	private clearGameData(id: string) {
		this.gameData.delete(id);
		localStorage.removeItem('game');
		localStorage.removeItem('gameId');
		this.facadeService.game.next(null);
	}

	refreshFriends(event) {
		this.facadeService
			.getFriends(this.user.getValue().sub)
			.then((friendsData: any[]) => this.friends.next(friendsData));
	}

	navigateToPackages() {
		this.router.navigate(['/app/'], {
			queryParams: { userId: this.user.getValue().sub },
		});
	}

	navigateToCash() {
		const user = this.user.getValue();
		this.router.navigate(['/app/convert-to-cash'], {
			queryParams: { userId: user.sub, goldPoints: user['custom:gold_points'] },
		});
	}
}

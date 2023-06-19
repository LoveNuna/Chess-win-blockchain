import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

// rxjs
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

// services
import { FacadeService } from 'facade-service';

// constants
import { gameActionTypes } from '../../../../common/constants/game-action-types';

// functions
import {
	gameTimeTypeToSec,
	secToMinutesAndSec,
} from '../../../../common/functions/game-timers';
import { getErrorFromCode } from 'src/app/common/functions/auth-errors';

// game data
import {
	newGameMove,
	userSide,
	blackTime,
	whiteTime,
	gameHistory,
	whitePiecesTaken,
	blackPiecesTaken,
} from '../../components/game/game-engine/game-data';

// dialogs
import { AbandonGameComponent } from '../../../../common/components/dialogs/abandon-game/abandon-game.component';
import { DrawGameOfferComponent } from '../../../../common/components/dialogs/draw-game-offer/draw-game-offer.component';
import { GameAbandonedComponent } from '../../../../common/components/dialogs/game-abandoned/game-abandoned.component';
import { GameEndComponent } from '../../../../common/components/dialogs/game-end/game-end.component';
import { OfferDrawGameComponent } from '../../../../common/components/dialogs/offer-draw-game/offer-draw-game.component';

@Component({
	selector: 'app-game',
	templateUrl: './game.component.html',
	styleUrls: ['./game.component.scss'],
})
export class GameComponent implements OnInit {
	game: BehaviorSubject<any> = new BehaviorSubject<any>(null);

	blackTimeout;
	whiteTimeout;

	movesHistory = [];

	constructor(
		private facadeService: FacadeService,
		private dialog: MatDialog,
		private router: Router
	) {}

	ngOnInit() {
		this.game = this.facadeService.game;

		this.game.pipe(take(1)).subscribe((data) => {
			if (data) {
				const totalSeconds = gameTimeTypeToSec(data.gameTimeType);
				const timeData = secToMinutesAndSec(totalSeconds);

				blackTime.next(timeData);
				whiteTime.next(timeData);

				const side =
					data.blackPlayerId === this.facadeService.user.getValue().sub
						? 'b'
						: 'w';

				userSide.next(side);

				window.addEventListener('beforeunload', async (e) => {
					const message =
						'Are you sure you want to leave this page? You will automatically lose the game if you do so!';
					e.returnValue = message;

					await this.facadeService.abortGameLambda(
						localStorage.getItem('gameId'),
						this.facadeService.user.getValue().sub
					);
					await this.facadeService.unsubscribeGameLambda(
						localStorage.getItem('gameId'),
						this.facadeService.connectionId.getValue()
					);

					localStorage.removeItem('game');
					localStorage.removeItem('gameId');

					this.facadeService.game.next(null);
					this.facadeService.chatMessage.next(null);

					return message;
				});
			} else {
				window.removeEventListener('beforeunload', (e) => {});
			}
		});

		newGameMove.subscribe((data) => {
			if (data && data.payload) {
				const moveData = {
					move: {
						from: data.payload.from,
						to: data.payload.to,
						promotion: data.payload.promotion,
					},
					fen: data.payload.fen,
				};

				this.movesHistory.push(moveData);
			}

			if (data && !data.payload) {
				this.handleNewMove(data);
			}
		});

		this.facadeService.gameMove.subscribe((data) => {
			if (data) {
				this.handleNewOpponentMove(data);
				this.handleTimers(data);
			}
		});

		gameHistory.subscribe((data) => {
			if (data && data.length) {
				const item = data[data.length - 1];

				if (item && item.captured) {
					let captured = item.captured.toUpperCase();

					if (item.color === 'w') {
						captured = 'w' + captured;

						let blackTaken = blackPiecesTaken.getValue();
						blackTaken = [...blackTaken, captured];

						blackPiecesTaken.next(blackTaken);
					} else {
						captured = 'b' + captured;

						let whiteTaken = whitePiecesTaken.getValue();
						whiteTaken = [...whiteTaken, captured];

						blackPiecesTaken.next(whiteTaken);
					}
				}
			}
		});

		this.facadeService.gameAbort.subscribe((data) => {
			if (data && data.userId !== this.facadeService.user.getValue().sub) {
				const opponendAbandonedGameDialog = this.dialog.open(
					GameAbandonedComponent,
					{
						width: '500px',
						panelClass: 'challenge-dialog',
						data,
					}
				);

				opponendAbandonedGameDialog.afterClosed().subscribe(() => {
					this.facadeService.openSimpleSnackbar('Ending game...');

					this.facadeService
						.unsubscribeGameLambda(
							this.game.getValue().id,
							this.facadeService.connectionId.getValue()
						)
						.then((usubData) => {
							this.facadeService.openSnackbarWithDismiss('Game ended', 5000);

							this.router.navigate(['/app']);

							this.clearGameData();
						})
						.catch((error) => {
							this.facadeService.openSnackbarWithTimer(
								'An error occurred!',
								2500
							);
						});
				});
			}
		});

		this.facadeService.drawRequest.subscribe((data) => {
			if (data && data.userId !== this.facadeService.user.getValue().sub) {
				const drawOfferDialog = this.dialog.open(DrawGameOfferComponent, {
					width: '500px',
					panelClass: 'challenge-dialog',
					disableClose: true,
				});

				drawOfferDialog.afterClosed().subscribe(async (dialogData) => {
					if (dialogData) {
						this.facadeService.openSnackbarWithDismiss(
							'Accepting draw offer...',
							5000
						);
						try {
							await this.facadeService.sendDrawRequestLambda(
								this.game.getValue().id,
								this.game.getValue().user.sub,
								this.game.getValue().opponent.id,
								gameActionTypes.DRAW_REQUEST_ACCEPT
							);

							this.facadeService.openSimpleSnackbar(
								'You accepted the draw offer. Ending game...'
							);

							await this.facadeService.unsubscribeGameLambda(
								this.game.getValue().id,
								this.facadeService.connectionId.getValue()
							);

							this.facadeService.openSnackbarWithDismiss(
								'Game ended in a draw',
								5000
							);

							this.router.navigate(['/app']);

							this.clearGameData();
						} catch (error) {
							this.facadeService.openSnackbarWithDismiss(
								'An error occurred',
								5000
							);
						}
					} else {
						this.facadeService.openSnackbarWithDismiss(
							'Declining draw offer...',
							5000
						);

						await this.facadeService.sendDrawRequestLambda(
							this.game.getValue().id,
							this.game.getValue().user.sub,
							this.game.getValue().opponent.id,
							gameActionTypes.DRAW_REQUEST_DECLINE
						);

						this.facadeService.openSnackbarWithDismiss(
							'You declined draw offer',
							5000
						);
					}
				});
			}
		});

		this.facadeService.drawRequestAccept.subscribe(async (data) => {
			if (data && data.userId !== this.facadeService.user.getValue().sub) {
				this.facadeService.openSimpleSnackbar(
					'Your opponent accepted the draw offer. Ending game...'
				);

				try {
					await this.facadeService.unsubscribeGameLambda(
						this.game.getValue().id,
						this.facadeService.connectionId.getValue()
					);

					this.facadeService.openSnackbarWithDismiss(
						'Game ended in a draw',
						5000
					);

					this.router.navigate(['/app']);

					this.clearGameData();
				} catch (error) {
					this.facadeService.openSnackbarWithDismiss(
						'Ann error occurred',
						5000
					);
				}
			}
		});

		this.facadeService.drawRequestDecline.subscribe((data) => {
			if (data && data.userId !== this.facadeService.user.getValue().sub) {
				this.facadeService.openSnackbarWithDismiss(
					'Your opponent the declined draw offer!',
					5000
				);
			}
		});

		this.facadeService.gameEnded.subscribe((data) => {
			if (data) {
				const gameEndDialog = this.dialog.open(GameEndComponent, {
					width: '500px',
					panelClass: 'challenge-dialog',
					data: {
						...data.payload,
						winner:
							data.payload.winnerId === this.facadeService.user.getValue().sub,
					},
				});

				gameEndDialog.afterClosed().subscribe((dialogData) => {
					if (dialogData) {
						this.facadeService.openSimpleSnackbar('Sending rematch request...');

						console.log('game in game', this.game.getValue());

						// this.facadeService
						//	 .sendGameRequestLambda(this.game.getValue().userId, this.game.getValue().opponentId, {
						//		 userId: data.userId,
						//		 opponentId: data.opponentId,
						//		 points: data.challengeAmmount,
						//		 type: data.challengeType,
						//		 gameTimeType: data.challengeTime,
						//		 fairPlayEnabled: data.fairPlay
						//	 })
						//	 .then(() => {
						//		 this.facadeService.openSnackbarWithDismiss('Challenge sent!', 5000);
						//	 })
						//	 .catch(error => {
						//		 if (error) {
						//			 const errorMessage = getErrorFromCode(error);
						//			 this.facadeService.openSnackbarWithDismiss(errorMessage, 5000);
						//		 }
						//	 });
					} else {
						this.facadeService
							.unsubscribeGameLambda(
								this.game.getValue().id,
								this.facadeService.connectionId.getValue()
							)
							.then(() => {
								this.clearGameData();
								this.router.navigate(['/app']);
							})
							.catch((error) => {
								this.facadeService.openSnackbarWithDismiss(
									'An error occurred!',
									5000
								);
							});
					}
				});
			}
		});
	}

	handleNewMove(moveData: any) {
		this.facadeService.newGameMoveLambda(
			this.game.getValue().id,
			this.facadeService.user.getValue().sub,
			moveData.fen,
			{
				...moveData.move,
				promotion: 'q',
			}
		);
	}

	handleNewOpponentMove(data) {
		newGameMove.next(data);
	}

	handleTimers(data) {
		if (data.payload.whitePLastMoveTime === data.payload.lastMoveTime) {
			this.timeoutBlack(data);
		} else {
			this.timeoutWhite(data);
		}
	}

	timeoutBlack(data) {
		let blackTimeLeft = data.payload.blackPTimeLeftInSec;

		if (blackTimeLeft === 0 && data.payload.movesCount === 3) {
			blackTimeLeft = gameTimeTypeToSec(this.game.getValue().gameTimeType);
		}

		if (this.whiteTimeout) {
			clearInterval(this.whiteTimeout);
		}

		if (blackTimeLeft > 0 || data.payload.movesCount === 3) {
			this.blackTimeout = setInterval(() => {
				blackTime.next(secToMinutesAndSec(blackTimeLeft--));

				if (blackTimeLeft < 0) {
					clearInterval(this.blackTimeout);

					this.handleNewMove({
						fen: this.movesHistory[this.movesHistory.length - 1].fen,
						from: this.movesHistory[this.movesHistory.length - 1].from,
						to: this.movesHistory[this.movesHistory.length - 1].to,
					});
				}
			}, 1000);
		}
	}

	timeoutWhite(data) {
		let whiteTimeLeft = data.payload.whitePTimeLeftInSec;

		if (whiteTimeLeft === 0 && data.payload.movesCount === 2) {
			whiteTimeLeft = gameTimeTypeToSec(this.game.getValue().gameTimeType);
		}

		if (this.blackTimeout) {
			clearInterval(this.blackTimeout);
		}

		if (whiteTimeLeft > 0 || data.payload.movesCount === 2) {
			this.whiteTimeout = setInterval(() => {
				whiteTime.next(secToMinutesAndSec(whiteTimeLeft--));

				if (whiteTimeLeft < 0) {
					clearInterval(this.whiteTimeout);

					this.handleNewMove({
						fen: this.movesHistory[this.movesHistory.length - 1].fen,
						from: this.movesHistory[this.movesHistory.length - 1].from,
						to: this.movesHistory[this.movesHistory.length - 1].to,
					});
				}
			}, 1000);
		}
	}

	handleDrawOffer(event) {
		const offerDrawDialog = this.dialog.open(OfferDrawGameComponent, {
			width: '500px',
			panelClass: 'challenge-dialog',
		});

		offerDrawDialog.afterClosed().subscribe(async (data) => {
			if (data) {
				this.facadeService.openSnackbarWithDismiss(
					'Sending draw offer...',
					5000
				);

				this.facadeService
					.sendDrawRequestLambda(
						this.game.getValue().id,
						this.game.getValue().user.sub,
						this.game.getValue().opponent.id,
						gameActionTypes.DRAW_REQUEST
					)
					.then((drawRequestData) => {
						this.facadeService.openSnackbarWithDismiss(
							'Draw request sent!',
							5000
						);
					})
					.catch((error) => {
						this.facadeService.openSnackbarWithDismiss(
							'An error occurred!',
							5000
						);
					});
			}
		});
	}

	handleAbandonGame(event) {
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

					this.facadeService.openSnackbarWithDismiss('Game abandoned', 5000);

					this.router.navigate(['/app']);

					this.clearGameData();
				} catch (error) {
					this.facadeService.openSnackbarWithTimer('An error occurred!', 2500);
				}
			}
		});
	}

	private clearGameData() {
		localStorage.removeItem('game');
		localStorage.removeItem('gameId');
		this.facadeService.game.next(null);
		this.facadeService.chatMessage.next(null);
		clearInterval(this.blackTimeout);
		clearInterval(this.whiteTimeout);
	}
}

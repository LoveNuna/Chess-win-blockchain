import { Injectable, Injector } from '@angular/core';

// rxjs
import { BehaviorSubject } from 'rxjs';
import { take, filter } from 'rxjs/operators';

// services
import { AdminService } from './admin.service';
import { AuthService } from './auth.service';
import { ChatService } from './chat.service';
import { FriendsService } from './friends.service';
import { GameService } from './game.service';
import { LanguageService } from './language.service';
import { PointsService } from './points.service';
import { PaymentService } from './payment.service';
import { SnackbarService } from './snackbar.service';

// functions
import { openConnection, webSocketEvent, close } from './web-socket-client';

// constants
import { gameActionTypes } from '../../common/constants/game-action-types';
import { userActionTypes } from '../../common/constants/user-action-types';

// interfaces
import { User } from '../../common/models/user';

@Injectable()
export class FacadeService {
	adminLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	user: BehaviorSubject<User> = new BehaviorSubject<User>(null);
	game: BehaviorSubject<User> = new BehaviorSubject<User>(null);

	pointsUpdated: BehaviorSubject<any> = new BehaviorSubject<any>(null);
	newGameRequest: BehaviorSubject<any> = new BehaviorSubject<any>(null);
	gameRequestDeclined: BehaviorSubject<any> = new BehaviorSubject<any>(null);
	gameRequestAccepted: BehaviorSubject<any> = new BehaviorSubject<any>(null);
	connectionId: BehaviorSubject<any> = new BehaviorSubject<any>(null);
	chatMessage: BehaviorSubject<any> = new BehaviorSubject<any>(null);
	gameMove: BehaviorSubject<any> = new BehaviorSubject<any>(null);
	gameAbort: BehaviorSubject<any> = new BehaviorSubject<any>(null);
	drawRequest: BehaviorSubject<any> = new BehaviorSubject<any>(null);
	drawRequestDecline: BehaviorSubject<any> = new BehaviorSubject<any>(null);
	drawRequestAccept: BehaviorSubject<any> = new BehaviorSubject<any>(null);
	gameEnded: BehaviorSubject<any> = new BehaviorSubject<any>(null);

	private $adminService: AdminService;
	private $authService: AuthService;
	private $chatService: ChatService;
	private $friendsService: FriendsService;
	private $gameService: GameService;
	private $languageService: LanguageService;
	private $pointsService: PointsService;
	private $paymentService: PaymentService;
	private $snackbarService: SnackbarService;

	public get adminService(): AdminService {
		if (!this.$adminService) {
			this.$adminService = this.injector.get(AdminService);
		}

		return this.$adminService;
	}

	public get chatService(): ChatService {
		if (!this.$chatService) {
			this.$chatService = this.injector.get(ChatService);
		}

		return this.$chatService;
	}

	public get authService(): AuthService {
		if (!this.$authService) {
			this.$authService = this.injector.get(AuthService);
		}

		return this.$authService;
	}

	public get friendsService(): FriendsService {
		if (!this.$friendsService) {
			this.$friendsService = this.injector.get(FriendsService);
		}

		return this.$friendsService;
	}

	public get gameService(): GameService {
		if (!this.$gameService) {
			this.$gameService = this.injector.get(GameService);
		}

		return this.$gameService;
	}

	public get languageService(): LanguageService {
		if (!this.$languageService) {
			this.$languageService = this.injector.get(LanguageService);
		}

		return this.$languageService;
	}

	public get pointsService(): PointsService {
		if (!this.$pointsService) {
			this.$pointsService = this.injector.get(PointsService);
		}

		return this.$pointsService;
	}

	public get paymentService(): PaymentService {
		if (!this.$paymentService) {
			this.$paymentService = this.injector.get(PaymentService);
		}

		return this.$paymentService;
	}

	public get snackbarService(): SnackbarService {
		if (!this.$snackbarService) {
			this.$snackbarService = this.injector.get(SnackbarService);
		}

		return this.$snackbarService;
	}

	constructor(private injector: Injector) {
		this.adminLoggedIn = this.adminService.adminLoggedIn;
		this.user = this.authService.user;

		// this.user
		// 	.pipe(
		// 		filter(userData => !!userData),
		// 		take(1)
		// 	)
		// 	.subscribe(userData => this.openConnection(userData.sub));

		this.game = this.gameService.game;

		webSocketEvent.subscribe(event => {
			if (event) {
				this.handleWebSocketEvent(event);
			}
		});
	}

	// auth
	async getCurrentUser() {
		return this.authService.getCurrentUser();
	}

	async getAccessToken() {
		return this.authService.getAccessToken();
	}

	async login(username: string, password: string) {
		return this.authService.login(username, password);
	}

	signOut() {
		this.authService.signOut();

		close();
		this.connectionId.next(null);
		this.chatMessage.next(null);
	}

	// admin
	adminLogin(credentials: any) {
		return this.adminService.adminLogin(credentials);
	}

	adminSignout() {
		return this.adminService.adminSignout();
	}

	disableUser(userEmail: string) {
		return this.adminService.disableUser(userEmail);
	}

	enableUser(userEmail: string) {
		return this.adminService.enableUser(userEmail);
	}

	getDashboardData() {
		return this.adminService.getDashboardData();
	}

	getGoldCoinsData() {
		return this.adminService.getGoldCoinsData();
	}

	getWithdrawalData() {
		return this.adminService.getWithdrawalData();
	}

	getUsers(start?: number, limit?: number, filterValue?: string) {
		return this.adminService.getUsers(start, limit, filterValue);
	}

	getUser(userId: string) {
		return this.adminService.getUser(userId);
	}

	getUserStats(userId: string) {
		return this.adminService.getUserStats(userId);
	}

	getUserCognito(userEmail: string) {
		return this.adminService.getUserCognito(userEmail);
	}

	getTrackedUsers(numberOfDays: number) {
		return this.adminService.getTrackedUsers(numberOfDays);
	}

	getUsersGoldCoins(weekMonth: string) {
		return this.adminService.getUsersGoldCoins(weekMonth);
	}

	getUserWithdrawals() {
		return this.adminService.getUsersWithdrawals();
	}

	getUsersWithdrawals(weekMonth?: string) {
		return this.adminService.getUsersWithdrawals(weekMonth);
	}

	updateUserWithdrawalStatus(
		withdrawalStatus: number,
		playerId: string,
		drawGoldPoints: number
	) {
		return this.adminService.updateUserWithdrawalStatus(
			withdrawalStatus,
			playerId,
			drawGoldPoints
		);
	}

	// chat
	async sendChatMessageLambda(gameId: string, userId: string, message: string) {
		return this.chatService.sendChatMessageLambda(gameId, userId, message);
	}

	// facade
	handleWebSocketEvent(event) {
		switch (event.type) {
		case userActionTypes.POINTS_UPDATED:
			this.pointsUpdated.next(event);
			break;

		case gameActionTypes.NEW_GAME_REQUEST:
			this.newGameRequest.next(event);
			break;

		case gameActionTypes.GAME_REQUEST_DECLINED:
			this.gameRequestDeclined.next(event);
			break;

		case gameActionTypes.GAME_REQUEST_ACCEPTED:
			this.gameRequestAccepted.next(event);
			break;

		case gameActionTypes.CONNECTION_ID:
			this.connectionId.next(event.payload);
			break;

		case gameActionTypes.CHAT_MESSAGE:
			this.chatMessage.next(event);
			break;

		case gameActionTypes.GAME_MOVE:
			this.gameMove.next(event);
			break;

		case gameActionTypes.GAME_ABORT:
			this.gameAbort.next(event);
			break;

		case gameActionTypes.DRAW_REQUEST:
			this.drawRequest.next(event);
			break;

		case gameActionTypes.DRAW_REQUEST_DECLINE:
			this.drawRequestDecline.next(event);
			break;

		case gameActionTypes.DRAW_REQUEST_ACCEPT:
			this.drawRequestAccept.next(event);
			break;

		case gameActionTypes.GAME_ENDED:
			this.gameEnded.next(event);
			break;

		default:
			break;
		}
	}

	// friends
	async addFriend(userId: string, playerId: string) {
		return this.friendsService.addFriend(userId, playerId);
	}

	async getFriends(userId: string) {
		return this.friendsService.getFriends(userId);
	}

	async searchForFriend(username: string) {
		return this.friendsService.searchForFriends(username);
	}

	// game
	async abortGameLambda(gameId: string, userId: string) {
		return this.gameService.abortGameLambda(gameId, userId);
	}

	async acceptGameRequestLambda(game: any) {
		return this.gameService.acceptGameRequestLambda(game);
	}

	async cancelNewGameReuqest(gameId: string) {
		return this.gameService.cancelNewGameRequest(gameId);
	}

	async declineGameRequestLambda(opponentId: string, gameId: string) {
		return this.gameService.declineGameRequestLambda(opponentId, gameId);
	}

	async newGameMoveLambda(
		gameId: string,
		userId: string,
		fen: string,
		move: any
	) {
		return this.gameService.newGameMoveLambda(gameId, userId, fen, move);
	}

	async sendDrawRequestLambda(
		gameId: string,
		userId: string,
		playerId: string,
		type: gameActionTypes
	) {
		return this.gameService.sendDrawRequestLambda(
			gameId,
			userId,
			playerId,
			type
		);
	}

	async sendGameRequestLambda(
		userId: string,
		opponentId: string,
		gameOptions: any
	) {
		return this.gameService.sendGameRequestLambda(
			userId,
			opponentId,
			gameOptions
		);
	}

	async subscribeGameLambda(
		userId: string,
		gameId: string,
		connectionId: string
	) {
		return this.gameService.subscribeGameLambda(userId, gameId, connectionId);
	}

	async unsubscribeGameLambda(gameId: string, connectionId: string) {
		return this.gameService.unsubscribeGameLambda(gameId, connectionId);
	}

	// language
	getLanguageLabels(): BehaviorSubject<any> {
		return this.languageService.getLanguageLabels();
	}

	async setLanguage(languageId: string) {
		return this.languageService.setLanguage(languageId);
	}

	// points
	async addUserPoints(userId: string, goldPoints: number, source?: string) {
		return this.pointsService.addUserPoints(userId, goldPoints, source);
	}

	async updateUserPoints(userId: string, goldPoints: number) {
		return this.pointsService.updateUserPoints(userId, goldPoints);
	}

	async requestWithdrawal(
		playerId: string,
		drawGoldPoints: number,
		paypalEmail: string
	) {
		return this.pointsService.requestWithdrawal(
			playerId,
			drawGoldPoints,
			paypalEmail
		);
	}

	// payment
	async merchantPay(
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
		return this.paymentService.merchantPay(
			firstname,
			lastname,
			address,
			city,
			state,
			zip,
			amount,
			paymentToken,
			playerId
		);
	}

	// snackbar
	closeSnackbar() {
		return this.snackbarService.closeSnackbar();
	}

	openSimpleSnackbar(message: string) {
		return this.snackbarService.openSimpleSnackbar(message);
	}

	openSnackbar(message: string, time: number, navigationPath: string) {
		return this.snackbarService.openSnackbar(message, time, navigationPath);
	}

	openSnackbarWithAction(message: string, action: string, time: number) {
		return this.snackbarService.openSnackbarWithAction(message, action, time);
	}

	openSnackbarWithDismiss(message: string, time: number) {
		return this.snackbarService.openSnackbarWithDismiss(message, time);
	}

	openSnackbarWithTimer(message: string, time: number) {
		return this.snackbarService.openSnackbarWithTimer(message, time);
	}

	// web socket client
	openConnection(userId: string) {
		return openConnection(userId);
	}
}

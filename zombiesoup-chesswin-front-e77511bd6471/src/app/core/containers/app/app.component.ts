import { Platform } from '@angular/cdk/platform';
import { Component, OnInit } from '@angular/core';
// services
import { FacadeService } from 'facade-service';
import { CookieService } from 'ngx-cookie-service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	public url: string = null;

	constructor(
		private platform: Platform,
		private facadeService: FacadeService,
		private cookieService: CookieService,
	) {
		this.url = this.getPlatformUrl();
	}

	private getPlatformUrl() {
		if (this.platform.ANDROID)
			return 'https://chesswin-front.s3.amazonaws.com/assets/downloads/chesswin-latest.apk';
		if (this.platform.IOS)
			return 'https://apps.apple.com/us/app/chess-win/id1487134837';

		return null;
	}

	async ngOnInit() {
		const gameId = localStorage.getItem('gameId');

		if (gameId && gameId.trim() !== '') {
			await this.facadeService.abortGameLambda(localStorage.getItem('gameId'), this.facadeService.user.getValue().sub);
			await this.facadeService.unsubscribeGameLambda(localStorage.getItem('gameId'), this.facadeService.connectionId.getValue());

			localStorage.removeItem('game');
			localStorage.removeItem('gameId');

			this.facadeService.game.next(null);
			this.facadeService.chatMessage.next(null);

			this.facadeService.openSnackbarWithDismiss('Because you left the last game you automatically lost!', 2000);
		}

		const languageId = this.cookieService.get('language');

		if (languageId) {
			this.facadeService.setLanguage(languageId);
		} else {
			this.facadeService.setLanguage('en');

			this.cookieService.set('language', 'en');
		}
	}
}

import { NgModule, APP_INITIALIZER } from '@angular/core';

// services
import { FacadeService } from './services/facade.service';
import { AdminService } from './services/admin.service';
import { AuthService } from './services/auth.service';
import { ChatService } from './services/chat.service';
import { FriendsService } from './services/friends.service';
import { GameService } from './services/game.service';
import { LanguageService } from './services/language.service';
import { PointsService } from './services/points.service';
import { SnackbarService } from './services/snackbar.service';

export function init_app(authService: AuthService) {
	return () => authService.getCurrentUser();
}

@NgModule({
	providers: [
		FacadeService,
		AdminService,
		AuthService,
		ChatService,
		FriendsService,
		GameService,
		LanguageService,
		PointsService,
		SnackbarService,
		{ provide: APP_INITIALIZER, useFactory: init_app, deps: [AuthService], multi: true }
	]
})
export class FacadeModule {}

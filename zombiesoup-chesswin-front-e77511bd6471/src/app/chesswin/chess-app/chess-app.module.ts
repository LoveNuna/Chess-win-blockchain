import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';

// modules
import { CommonModule } from 'common-module';
import { ChessAppRoutingModule } from './routing/chess-app.routing';

// containers
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { GameComponent } from './containers/game/game.component';

// components
import { ChallengeViewComponent } from './components/side-nav/challenge-view/challenge-view.component';
import { FriendsViewComponent } from './components/side-nav/friends-view/friends-view.component';
import { GameEngineComponent } from './components/game/game-engine/game-engine.component';
import { GameViewComponent } from './components/game/game-view/game-view.component';
import { MessagesViewComponent } from './components/messages-view/messages-view.component';
import { ProfileViewComponent } from './components/side-nav/profile-view/profile-view.component';
import { ChallengeDialogComponent } from './components/side-nav/challenge-dialog/challenge-dialog.component';
import { PackagesViewComponent } from '../landing/components/packages-view/packages-view.component';
import { PackagesComponent } from '../landing/containers/packages/packages.component';
import { ConvertToCashViewComponent } from './components/side-nav/convert-to-cash-view/convert-to-cash-view.component';
import { CreditCardViewComponent } from './components/side-nav/credit-card-view/credit-card-view.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ChessAppRoutingModule,
		LayoutModule,
		ReactiveFormsModule
	],
	declarations: [
		// containers
		DashboardComponent,
		GameComponent,
		PackagesComponent,
		// components
		PackagesViewComponent,
		ChallengeViewComponent,
		FriendsViewComponent,
		GameEngineComponent,
		GameViewComponent,
		MessagesViewComponent,
		ProfileViewComponent,
		// dialogs
		ChallengeDialogComponent,
		ConvertToCashViewComponent,
		CreditCardViewComponent
	],
	entryComponents: [ChallengeDialogComponent]
})
export class ChessAppModule {}

import { NgModule } from '@angular/core';
import { CommonModule as AngularCommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// modules
import { MaterialModule } from '../material/material.module';

// components
import { FooterComponent } from './components/footer/footer.component';
import { HeaderComponent } from './components/header/header.component';
import { AccordionDirective } from './directives/accordion.directive';

// pipes
import { NumberHumanizerPipe } from './pipes/number-humanizer.pipe';
import { OrderByDatePipe } from './pipes/order-by-date.pipe';

// dialogs
import { AbandonGameComponent } from './components/dialogs/abandon-game/abandon-game.component';
import { DrawGameOfferComponent } from './components/dialogs/draw-game-offer/draw-game-offer.component';
import { ChallengeReceivedComponent } from './components/dialogs/challenge-received/challenge-received.component';
import { GameAbandonedComponent } from './components/dialogs/game-abandoned/game-abandoned.component';
import { GameEndComponent } from './components/dialogs/game-end/game-end.component';
import { LoadingComponent } from './components/loading/loading.component';
import { OfferDrawGameComponent } from './components/dialogs/offer-draw-game/offer-draw-game.component';
import { PaginatorComponent } from './components/paginator/paginator.component';
import { WithdrawDialogComponent } from './components/dialogs/withdraw-dialog/withdraw-dialog.component';

@NgModule({
	imports: [
		AngularCommonModule,
		RouterModule,
		FormsModule,
		ReactiveFormsModule,
		MaterialModule
	],
	declarations: [
		// components
		FooterComponent,
		HeaderComponent,
		LoadingComponent,
		PaginatorComponent,
		// directives
		AccordionDirective,
		// pipes
		NumberHumanizerPipe,
		OrderByDatePipe,
		// dialogs
		AbandonGameComponent,
		ChallengeReceivedComponent,
		DrawGameOfferComponent,
		GameAbandonedComponent,
		GameEndComponent,
		OfferDrawGameComponent,
		WithdrawDialogComponent
	],
	exports: [
		// modules
		AngularCommonModule,
		MaterialModule,
		// components
		FooterComponent,
		HeaderComponent,
		LoadingComponent,
		PaginatorComponent,
		// directives
		AccordionDirective,
		// pipes
		NumberHumanizerPipe,
		OrderByDatePipe,
		// dialogs
		AbandonGameComponent,
		ChallengeReceivedComponent,
		DrawGameOfferComponent,
		GameAbandonedComponent,
		GameEndComponent,
		OfferDrawGameComponent
	],
	entryComponents: [
		AbandonGameComponent,
		ChallengeReceivedComponent,
		DrawGameOfferComponent,
		GameAbandonedComponent,
		GameEndComponent,
		OfferDrawGameComponent
	]
})
export class CommonModule {}

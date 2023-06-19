import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

// constants
import { challengeType } from '../../../../../common/constants/challenge-type';

// functions
import { getTimeByType } from '../../../../../common/functions/game-timers';

@Component({
	selector: 'app-users-details-view',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './users-details-view.component.html',
	styleUrls: ['./users-details-view.component.scss']
})
export class UsersDetailsViewComponent {
	@Input() user: any;
	@Input() userGameHistory: any[];
	@Input() requesting: boolean;

	@Output() userStatusEmitter: EventEmitter<any> = new EventEmitter<any>();
	@Output() updateGoldCoinsEmitter: EventEmitter<number> = new EventEmitter<number>();

	challengeType = challengeType;
	getTimeByType = getTimeByType;

	emitUserStatus(email: string, status: boolean) {
		this.userStatusEmitter.emit({ email, status });
	}

	emitUpdateGoldCoins(goldPoints: number) {
		this.updateGoldCoinsEmitter.emit(goldPoints);
	}
}

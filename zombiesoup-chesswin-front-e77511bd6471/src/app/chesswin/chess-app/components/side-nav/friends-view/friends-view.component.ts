import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

// constants
import { statusType } from '../../../../../common/constants/status-type';
import { trigger, transition, animate, keyframes, style } from '@angular/animations';

@Component({
	selector: 'app-friends-view',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './friends-view.component.html',
	styleUrls: ['./friends-view.component.scss'],
	animations: [
		trigger('roll', [
			transition('true <=> false', [animate(200, keyframes([style({ transform: 'rotate(0)' }), style({ transform: 'rotate(360deg)' })]))])
		])
	]
})
export class FriendsViewComponent {
	@Input() friends: any[];

	@Output() challengeEmitter: EventEmitter<any> = new EventEmitter<any>();
	@Output() refreshFriendsEmitter: EventEmitter<any> = new EventEmitter<any>();

	statusType = statusType;

	showFriends = true;

	rollIcon = false;

	emitChallenge(friend) {
		this.challengeEmitter.emit(friend);
	}

	emitRefreshFriends() {
		this.rollIcon = !this.rollIcon;

		this.refreshFriendsEmitter.emit();
	}
}

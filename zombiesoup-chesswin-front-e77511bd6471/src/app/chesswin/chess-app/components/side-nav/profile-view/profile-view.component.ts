import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

// interfaces
import { User } from '../../../../../common/models/user';

@Component({
	selector: 'app-profile-view',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './profile-view.component.html',
	styleUrls: ['./profile-view.component.scss']
})
export class ProfileViewComponent {
	@Input() user: User;

	@Output() signOutEmitter: EventEmitter<any> = new EventEmitter<any>();

	emitSignOut() {
		this.signOutEmitter.emit();
	}
}

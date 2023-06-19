import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-tracked-users-list-view',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './tracked-users-list-view.component.html',
	styleUrls: ['./tracked-users-list-view.component.scss']
})
export class TrackedUsersListViewComponent {
	@Input() users: any;
	@Input() requesting: boolean;

	@Output() filterEmitter: EventEmitter<number> = new EventEmitter<number>();
	@Output() userEmitter: EventEmitter<any> = new EventEmitter<any>();

	filterValue = 7;

	emitFilter(filterValue: number) {
		this.filterValue = filterValue;

		this.filterEmitter.emit(filterValue);
	}

	emitUser(user: any) {
		this.userEmitter.emit(user);
	}
}

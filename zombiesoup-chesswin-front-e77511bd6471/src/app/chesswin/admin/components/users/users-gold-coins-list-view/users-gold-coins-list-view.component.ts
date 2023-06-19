import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-users-gold-coins-list-view',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './users-gold-coins-list-view.component.html',
	styleUrls: ['./users-gold-coins-list-view.component.scss']
})
export class UsersGoldCoinsListViewComponent {
	@Input() users: any;
	@Input() requesting: boolean;

	@Output() filterEmitter: EventEmitter<string> = new EventEmitter<string>();
	@Output() userEmitter: EventEmitter<any> = new EventEmitter<any>();

	filterValue = 'week';

	emitFilter(filterValue: string) {
		this.filterValue = filterValue;

		this.filterEmitter.emit(filterValue);
	}

	emitUser(user: any) {
		this.userEmitter.emit(user);
	}
}

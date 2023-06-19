import {
	Component,
	ChangeDetectionStrategy,
	Input,
	Output,
	EventEmitter,
	ViewChild,
	ElementRef,
	AfterViewInit
} from '@angular/core';

// rxjs
import { fromEvent } from 'rxjs';
import { distinctUntilChanged, debounceTime, map } from 'rxjs/operators';

@Component({
	selector: 'app-users-list-view',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './users-list-view.component.html',
	styleUrls: ['./users-list-view.component.scss']
})
export class UsersListViewComponent implements AfterViewInit {
	@Input() users: any;
	@Input() totalUsers;
	@Input() requesting: boolean;

	@Output() filterEmitter: EventEmitter<string> = new EventEmitter<string>();
	@Output() userEmitter: EventEmitter<any> = new EventEmitter<any>();

	@ViewChild('filterInput', { static: true }) filterInput: ElementRef;

	ngAfterViewInit() {
		fromEvent(this.filterInput.nativeElement, 'input')
			.pipe(
				map((event: any) => event.target.value),
				debounceTime(1000),
				distinctUntilChanged()
			)
			.subscribe(filterValue => {
				this.emitFilter(filterValue);
			});
	}

	emitFilter(filterValue: string) {
		this.filterEmitter.emit(filterValue.toLowerCase());
	}

	emitUser(user: any) {
		this.userEmitter.emit(user);
	}
}

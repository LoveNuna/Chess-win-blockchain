import {
	Component,
	ChangeDetectionStrategy,
	Input,
	Output,
	EventEmitter
} from '@angular/core';

enum withdrawalStatus {
	accepted = 1,
	rejected = 2,
	requested = 0
}

@Component({
	selector: 'app-withdrawals-view',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './withdrawals-view.component.html',
	styleUrls: ['./withdrawals-view.component.scss']
})
export class WithdrawalsViewComponent {
	@Input() withdrawals: any[];
	@Input() requesting: boolean;

	@Output() filterEmitter: EventEmitter<string> = new EventEmitter<string>();
	@Output() actionEmitter: EventEmitter<any> = new EventEmitter<any>();

	withdrawalStatus = withdrawalStatus;

	filterValue = 'week';

	emitFilter(filterValue: string) {
		this.filterValue = filterValue;

		this.filterEmitter.emit(filterValue);
	}

	emitAction(event) {
		if (!this.requesting) {
			this.actionEmitter.emit(event);
		}
	}
}

import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';

// constants
import { challengeType } from '../../../../common/constants/challenge-type';
import { messageStatus } from '../../../../common/constants/message-status';

@Component({
	selector: 'app-messages-view',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './messages-view.component.html',
	styleUrls: ['./messages-view.component.scss']
})
export class MessagesViewComponent {
	@Input() messages: any[];
	@Input() game: any;
	@Input() messageStatus: messageStatus;

	@Output() messageEmitter: EventEmitter<string> = new EventEmitter<string>();

	message = '';

	challengeType = challengeType;

	emitMessage() {
		this.messageEmitter.emit(this.message);
		this.message = '';
	}
}

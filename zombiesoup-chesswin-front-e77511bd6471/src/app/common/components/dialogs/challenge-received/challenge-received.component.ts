import { Component, Inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// contants
import { challengeType } from '../../../constants/challenge-type';

// functions
import { getTimeByType } from '../../../functions/game-timers';

@Component({
	selector: 'app-challenge-received',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './challenge-received.component.html',
	styleUrls: ['./challenge-received.component.scss']
})
export class ChallengeReceivedComponent {
	challengeType = challengeType;
	getTimeByType = getTimeByType;

	constructor(public dialogRef: MatDialogRef<ChallengeReceivedComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: any) {}

	respondToRequest(respond: boolean) {
		this.dialogRef.close(respond);
	}
}

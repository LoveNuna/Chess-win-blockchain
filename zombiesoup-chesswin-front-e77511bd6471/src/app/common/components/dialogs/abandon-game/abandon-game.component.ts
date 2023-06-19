import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-abandon-game',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './abandon-game.component.html',
	styleUrls: ['./abandon-game.component.scss']
})
export class AbandonGameComponent {
	constructor(public dialogRef: MatDialogRef<AbandonGameComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: any) {}

	respondToRequest(respond: boolean) {
		this.dialogRef.close(respond);
	}
}

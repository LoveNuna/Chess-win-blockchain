import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-withdraw-dialog',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './withdraw-dialog.component.html',
	styleUrls: ['./withdraw-dialog.component.scss']
})
export class WithdrawDialogComponent {

	constructor(public dialogRef: MatDialogRef<WithdrawDialogComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: any) { }

	respondToRequest(respond: boolean) {
		this.dialogRef.close(respond);
	}
}

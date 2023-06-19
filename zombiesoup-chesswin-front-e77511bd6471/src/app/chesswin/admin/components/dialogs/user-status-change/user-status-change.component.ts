import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-user-status-change',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './user-status-change.component.html',
	styleUrls: ['./user-status-change.component.scss']
})
export class UserStatusChangeComponent {
	constructor(public dialogRef: MatDialogRef<UserStatusChangeComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: any) {}

	respondToRequest(respond: boolean) {
		this.dialogRef.close(respond);
	}
}

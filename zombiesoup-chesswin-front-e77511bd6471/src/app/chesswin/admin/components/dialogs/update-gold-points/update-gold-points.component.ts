import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-update-gold-points',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './update-gold-points.component.html',
	styleUrls: ['./update-gold-points.component.scss']
})
export class UpdateGoldPointsComponent {
	constructor(public dialogRef: MatDialogRef<UpdateGoldPointsComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: any) {}

	respondToRequest(respond: boolean) {
		this.dialogRef.close({ accepted: respond, points: this.dialogData.goldPoints });
	}
}

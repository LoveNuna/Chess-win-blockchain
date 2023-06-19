import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-game-abandoned',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './game-abandoned.component.html',
	styleUrls: ['./game-abandoned.component.scss']
})
export class GameAbandonedComponent {
	constructor(public dialogRef: MatDialogRef<GameAbandonedComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: any) {}

	respondToRequest() {
		this.dialogRef.close();
	}
}

import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-game-end',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './game-end.component.html',
	styleUrls: ['./game-end.component.scss']
})
export class GameEndComponent {
	constructor(public dialogRef: MatDialogRef<GameEndComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: any) {}

	respondToRequest(rematch: boolean) {
		this.dialogRef.close(rematch);
	}
}

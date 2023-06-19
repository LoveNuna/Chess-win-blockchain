import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-draw-game-offer',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './draw-game-offer.component.html',
	styleUrls: ['./draw-game-offer.component.scss']
})
export class DrawGameOfferComponent {
	constructor(public dialogRef: MatDialogRef<DrawGameOfferComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: any) {}

	respondToRequest(respond: boolean) {
		this.dialogRef.close(respond);
	}
}

import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
	selector: 'app-offer-draw-game',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './offer-draw-game.component.html',
	styleUrls: ['./offer-draw-game.component.scss']
})
export class OfferDrawGameComponent {
	constructor(public dialogRef: MatDialogRef<OfferDrawGameComponent>, @Inject(MAT_DIALOG_DATA) public dialogData: any) {}

	respondToRequest(respond: boolean) {
		this.dialogRef.close(respond);
	}
}

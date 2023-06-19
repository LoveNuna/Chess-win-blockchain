import { Component, ChangeDetectionStrategy, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
	selector: 'app-package-payment',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './package-payment.component.html',
	styleUrls: ['./package-payment.component.scss']
})
export class PackagePaymentComponent {
	constructor(
		public dialogRef: MatDialogRef<PackagePaymentComponent>,
		@Inject(MAT_DIALOG_DATA) public dialogData: any
	) {}

	closeDialog(response: boolean) {
		this.dialogRef.close(response);
	}
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// services
import { FacadeService } from 'facade-service';

@Component({
	selector: 'app-packages',
	templateUrl: './packages.component.html',
	styleUrls: ['./packages.component.scss']
})
export class PackagesComponent implements OnInit {
	userId: string;

	constructor(
		private facadeService: FacadeService,
		private route: ActivatedRoute
	) {}

	ngOnInit() {
		this.facadeService.user.subscribe(data => {
			this.userId = data
				? data.sub
				: this.route.snapshot.queryParamMap.get('userId');
		});
	}

	async handlePayment(event) {
		if (!this.userId) {
			return;
		}

		const { shopPackage, error } = event;

		if (!shopPackage) {
			this.facadeService.openSnackbarWithTimer(
				'Please select a package!',
				3000
			);

			return;
		}

		if (error) {
			this.facadeService.openSnackbarWithDismiss('An error occurred!', 5000);

			return;
		}

		this.facadeService.openSimpleSnackbar('Processing transaction...');

		try {
			await this.facadeService.addUserPoints(this.userId, shopPackage.coins);

			this.facadeService.openSnackbar('Transaction completed!', 3000, '/app');
		} catch (error) {
			this.facadeService.openSnackbarWithDismiss('An error occurred!', 5000);
		}
	}
}

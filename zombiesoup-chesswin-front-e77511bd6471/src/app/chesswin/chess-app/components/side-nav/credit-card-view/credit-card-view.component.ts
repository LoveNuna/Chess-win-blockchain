import {
	Component,
	OnInit,
	AfterViewChecked,
	OnDestroy,
	ChangeDetectorRef,
} from '@angular/core';

import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

// rxjs
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// services
import { FacadeService } from 'facade-service';

@Component({
	selector: 'app-credit-card-view',
	templateUrl: './credit-card-view.component.html',
	styleUrls: ['./credit-card-view.component.scss'],
})
export class CreditCardViewComponent
implements AfterViewChecked, OnInit, OnDestroy {
	paymentForm: FormGroup;

	requesting: boolean;
	loading: boolean = false;
	submitted = false;

	firstnameError = false;
	lastnameError = false;
	addressError = false;
	cityError = false;
	stateError = false;
	zipError = false;

	buyGold;
	price;
	userId;

	destroyed: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private facadeService: FacadeService,
		private changeDetector: ChangeDetectorRef
	) {
		this.paymentForm = this.createForm();
	}

	ngOnInit() {
		this.paymentForm.valueChanges
			.pipe(takeUntil(this.destroyed))
			.subscribe(() =>
				this.submitted ? this.clearErrors() : (this.submitted = false)
			);

		this.route.queryParamMap.subscribe(
			(params) => (
				(this.buyGold = params.get('buyGold')),
				(this.price = params.get('price')),
				(this.userId = params.get('userId'))
			)
		);
	}

	ngAfterViewChecked() {
		CollectJS.configure({
			paymentType: 'cc',
			callback: (response) => this.handlePaymentBackend(response),
		});
	}

	ngOnDestroy() {
		this.destroyed.next(true);
		this.destroyed.complete();
	}

	handlePayment() {
		if (this.paymentForm.valid) {
			CollectJS.startPaymentRequest(event);
		}
	}

	async handlePaymentBackend(paymentInfo: any) {
		const userCred = {
			firstname: this.paymentForm.get('firstname').value,
			lastname: this.paymentForm.get('lastname').value,
			address: this.paymentForm.get('address').value,
			city: this.paymentForm.get('city').value,
			state: this.paymentForm.get('state').value,
			zip: this.paymentForm.get('zip').value,
			amount: this.price,
			paymentToken: paymentInfo.token,
			playerId: this.userId,
		};

		const firstname = this.paymentForm.get('firstname').value;
		const lastname = this.paymentForm.get('lastname').value;
		const address = this.paymentForm.get('address').value;
		const city = this.paymentForm.get('city').value;
		const state = this.paymentForm.get('state').value;
		const zip = this.paymentForm.get('zip').value;
		const amount = this.price;
		const paymentToken = paymentInfo.token;
		const playerId = this.userId;

		try {
			this.loading = true;

			this.changeDetector.detectChanges();

			const result = await this.facadeService.merchantPay(
				firstname,
				lastname,
				address,
				city,
				state,
				zip,
				amount,
				paymentToken,
				playerId
			);

			// 1 = Transaction Approved
			// 2 = Transaction Declined
			// 3 = Transaction failed, please try again later

			if (result === 1) {
				await this.facadeService.addUserPoints(
					this.userId,
					this.buyGold,
					'Merchant'
				);
				this.facadeService.openSnackbarWithDismiss(
					'Transaction Approved',
					5000
				);
			} else if (result === 2) {
				this.facadeService.openSnackbarWithDismiss(
					'Trasaction declined, invalid payment mode',
					5000
				);
			} else if (result === 3) {
				this.facadeService.openSnackbarWithDismiss(
					'Transaction failed, please try again later!',
					5000
				);
			}
			this.loading = false;
			this.changeDetector.detectChanges();
		} catch (error) {
			this.facadeService.openSnackbarWithDismiss('An error occurred!', 5000);
		}

		this.loading = false;
	}

	get firstNameInvalid() {
		const control = this.paymentForm.get('firstname');

		return !!control.errors;
	}

	get lastNameInvalid() {
		const control = this.paymentForm.get('lastname');

		return !!control.errors;
	}

	get streetAddressInvalid() {
		const control = this.paymentForm.get('address');

		return !!control.errors;
	}

	get cityInvalid() {
		const control = this.paymentForm.get('city');

		return !!control.errors;
	}

	get stateInvalid() {
		const control = this.paymentForm.get('state');

		return !!control.errors;
	}

	get zipCodeInvalid() {
		const control = this.paymentForm.get('zip');

		return !!control.errors;
	}

	emitForm() {
		if (!this.paymentForm.valid) {
			if (this.firstNameInvalid) {
				this.firstnameError = true;
			}
			if (this.lastNameInvalid) {
				this.lastnameError = true;
			}
			if (this.streetAddressInvalid) {
				this.addressError = true;
			}
			if (this.cityInvalid) {
				this.cityError = true;
			}
			if (this.stateInvalid) {
				this.stateError = true;
			}
			if (this.zipCodeInvalid) {
				this.zipError = true;
			}
		}

		this.submitted = true;
	}

	clearErrors() {
		this.firstnameError = false;
		this.lastnameError = false;
		this.addressError = false;
		this.cityError = false;
		this.stateError = false;
		this.zipError = false;
	}

	createForm() {
		return this.formBuilder.group({
			firstname: ['', [Validators.required]],
			lastname: ['', [Validators.required]],
			address: ['', Validators.required],
			city: ['', Validators.required],
			state: ['', Validators.required],
			zip: ['', Validators.required],
		});
	}
}

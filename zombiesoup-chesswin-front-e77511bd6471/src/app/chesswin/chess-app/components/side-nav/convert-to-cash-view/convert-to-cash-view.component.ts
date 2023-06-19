import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// rxjs
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// interfaces
import { User } from '../../../../../common/models/user';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FacadeService } from 'facade-service';
import { MatDialog } from '@angular/material/dialog';
import { WithdrawDialogComponent } from 'src/app/common/components/dialogs/withdraw-dialog/withdraw-dialog.component';

@Component({
	selector: 'app-convert-to-cash-view',
	templateUrl: './convert-to-cash-view.component.html',
	styleUrls: ['./convert-to-cash-view.component.scss'],
})
export class ConvertToCashViewComponent implements OnInit, OnDestroy {
	goldPointsValue = false;
	minimumGoldPoints = false;

	user;

	requesting: boolean;

	submitted = false;
	goldPointsError = false;
	paypalEmailError = false;

	withdrawalForm: FormGroup;

	destroyed: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		private facadeService: FacadeService,
		private dialog: MatDialog
	) {
		this.withdrawalForm = this.createForm();
	}

	ngOnInit() {
		this.facadeService.user.subscribe((data) => (this.user = data));

		this.withdrawalForm.valueChanges
			.pipe(takeUntil(this.destroyed))
			.subscribe(() =>
				this.submitted ? this.clearErrors() : (this.submitted = false)
			);
	}

	ngOnDestroy() {
		this.destroyed.next(true);
		this.destroyed.complete();
	}

	get goldPointInvalid() {
		const control = this.withdrawalForm.get('drawGoldPoints');

		return !!control.errors;
	}

	get paypalIdInvalid() {
		const control = this.withdrawalForm.get('paypalEmail');

		return !!control.errors;
	}

	async emitForm() {
		this.withdrawalForm.patchValue({
			playerId: this.user.sub,
		});
		this.requesting = true;
		if (
			this.withdrawalForm.valid 
		) {
			const requestValue = this.withdrawalForm.value;

			try {
				await this.facadeService.requestWithdrawal(
					requestValue.playerId,
					requestValue.drawGoldPoints,
					requestValue.paypalEmail
				);

				this.facadeService.openSnackbar(
					'Withdrawal successfully requested!',
					3000,
					'/'
				);
			} catch (error) {
				this.facadeService.openSimpleSnackbar(error);
			}

			this.withdrawalForm.reset();
		} else {
			if (
				this.withdrawalForm.get('drawGoldPoints').value < 20 &&
				this.withdrawalForm.get('drawGoldPoints').value !== ''
			) {
				this.minimumGoldPoints = true;
				this.dialog.open(WithdrawDialogComponent, {
					width: '500px',
					panelClass: 'challenge-dialog',
				});
			} else if (
				this.withdrawalForm.get('drawGoldPoints').value >
				this.user['custom:gold_points']
			) {
				this.goldPointsValue = true;
			} else if (this.goldPointInvalid) {
				this.goldPointsError = true;
			}

			if (this.paypalIdInvalid) {
				this.paypalEmailError = true;
			}
		}

		this.submitted = true;
		this.requesting = false;
	}

	clearErrors() {
		this.goldPointsError = false;
		this.paypalEmailError = false;
		this.goldPointsValue = false;
		this.minimumGoldPoints = false;
	}

	createForm() {
		return this.formBuilder.group({
			playerId: [''],
			drawGoldPoints: ['', [Validators.required, Validators.min(20)]],
			paypalEmail: ['', Validators.required],
		});
	}
}

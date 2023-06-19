import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';

// rxjs
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

// services
import { FacadeService } from 'facade-service';

// functions
import { getErrorFromCode } from '../../../../common/functions/auth-errors';

@Component({
	selector: 'app-home-view',
	templateUrl: './home-view.component.html',
	styleUrls: ['./home-view.component.scss']
})
export class HomeViewComponent implements OnInit, OnDestroy {
	requesting: boolean;
	serverError: string;

	loginForm: FormGroup;

	languageLabels;

	submitted = false;
	emailError = false;
	passwordError = false;

	destroyed: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(
		private facadeService: FacadeService,
		private formBuilder: FormBuilder,
		private router: Router
	) {
		this.loginForm = this.createForm();
	}

	ngOnInit() {
		this.facadeService
			.getLanguageLabels()
			.subscribe(data => (this.languageLabels = data));

		this.loginForm.valueChanges
			.pipe(takeUntil(this.destroyed))
			.subscribe(() =>
				this.submitted ? this.clearErrors() : (this.submitted = false)
			);
	}

	ngOnDestroy() {
		this.destroyed.next(true);
		this.destroyed.complete();
	}

	get emailInvalid() {
		const control = this.loginForm.get('email');

		return !!control.errors;
	}

	get passwordInvalid() {
		const control = this.loginForm.get('password');

		return !!control.errors;
	}

	async login(userCredentials) {
		this.requesting = true;
		this.serverError = '';

		try {
			await this.facadeService.login(
				userCredentials.email,
				userCredentials.password
			);
			console.log("sucess cognito")
			this.router.navigate(['/app/']);
			console.log("sucess apps")
			this.requesting = false;
		} catch (error) {
			console.log("I am second here")
			this.serverError = getErrorFromCode(error.code);

			this.requesting = false;
		}
	}

	emitLoginForm() {
		this.serverError = '';

		if (this.loginForm.valid) {
			this.login(this.loginForm.value);
		} else {
			if (this.emailInvalid) {
				this.emailError = true;
			}
			if (this.passwordInvalid) {
				this.passwordError = true;
			}
		}

		this.submitted = true;
	}

	clearErrors() {
		this.emailError = false;
		this.passwordError = false;
		this.serverError = '';
	}

	createForm() {
		return this.formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', Validators.required]
		});
	}
}

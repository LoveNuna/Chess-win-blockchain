import { Component, ChangeDetectionStrategy, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ReplaySubject } from 'rxjs';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';

@Component({
	selector: 'app-auth-form',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './auth-form.component.html',
	styleUrls: ['./auth-form.component.scss']
})
export class AuthFormComponent implements OnInit, OnDestroy {
	@Input() requesting: boolean;
	@Input() serverError: string;

	@Output() authFormEmitter: EventEmitter<any> = new EventEmitter<any>();

	authForm: FormGroup;

	submitted = false;

	destroyed: ReplaySubject<boolean> = new ReplaySubject(1);

	constructor(private formBuilder: FormBuilder, private router: Router) {
		this.authForm = this.createForm();
	}

	ngOnInit() {
		this.authForm.valueChanges.pipe(takeUntil(this.destroyed)).subscribe(() => {
			if (this.submitted) {
				this.submitted = false;
			}
		});
	}

	ngOnDestroy() {
		this.destroyed.next(true);
		this.destroyed.complete();
	}

	get usernameInvalid() {
		const control = this.authForm.get('username');

		return !!control.errors;
	}

	get passwordInvalid() {
		const control = this.authForm.get('password');

		return !!control.errors;
	}

	emitAuthForm() {
		if (this.authForm.valid) {
			this.authFormEmitter.emit(this.authForm.value);
			console.log("Here")
		}

		this.submitted = true;
	}

	createForm() {
		return this.formBuilder.group({
			username: ['', [Validators.required]],
			password: ['', Validators.required]
		});
	}
}

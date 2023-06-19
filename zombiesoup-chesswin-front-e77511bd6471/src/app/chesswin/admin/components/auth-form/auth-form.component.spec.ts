import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AuthFormComponent } from './auth-form.component';

describe('AuthFormComponent', () => {
	let component: AuthFormComponent;
	let fixture: ComponentFixture<AuthFormComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ AuthFormComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AuthFormComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

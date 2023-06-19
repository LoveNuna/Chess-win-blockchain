import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PackagePaymentComponent } from './package-payment.component';

describe('PackagePaymentComponent', () => {
	let component: PackagePaymentComponent;
	let fixture: ComponentFixture<PackagePaymentComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [PackagePaymentComponent]
		}).compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PackagePaymentComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

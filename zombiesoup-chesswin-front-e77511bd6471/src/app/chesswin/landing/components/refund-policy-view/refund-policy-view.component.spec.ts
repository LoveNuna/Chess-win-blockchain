import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { RefundPolicyViewComponent } from './refund-policy-view.component';

describe('RefundPolicyViewComponent', () => {
	let component: RefundPolicyViewComponent;
	let fixture: ComponentFixture<RefundPolicyViewComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ RefundPolicyViewComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(RefundPolicyViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

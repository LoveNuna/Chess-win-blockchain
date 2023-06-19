import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { PrivacyPolicyViewComponent } from './privacy-policy-view.component';

describe('PrivacyPolicyViewComponent', () => {
	let component: PrivacyPolicyViewComponent;
	let fixture: ComponentFixture<PrivacyPolicyViewComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ PrivacyPolicyViewComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(PrivacyPolicyViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

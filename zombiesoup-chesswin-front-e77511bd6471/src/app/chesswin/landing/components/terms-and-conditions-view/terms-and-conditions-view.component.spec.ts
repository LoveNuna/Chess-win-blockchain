import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TermsAndConditionsViewComponent } from './terms-and-conditions-view.component';

describe('TermsAndConditionsViewComponent', () => {
	let component: TermsAndConditionsViewComponent;
	let fixture: ComponentFixture<TermsAndConditionsViewComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ TermsAndConditionsViewComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TermsAndConditionsViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

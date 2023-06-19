import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { CreditCardViewComponent } from './credit-card-view.component';

describe('CreditCardViewComponent', () => {
	let component: CreditCardViewComponent;
	let fixture: ComponentFixture<CreditCardViewComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ CreditCardViewComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(CreditCardViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

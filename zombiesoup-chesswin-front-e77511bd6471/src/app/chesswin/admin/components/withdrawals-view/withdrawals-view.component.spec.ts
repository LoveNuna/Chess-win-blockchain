import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { WithdrawalsViewComponent } from './withdrawals-view.component';

describe('WithdrawalsViewComponent', () => {
	let component: WithdrawalsViewComponent;
	let fixture: ComponentFixture<WithdrawalsViewComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ WithdrawalsViewComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(WithdrawalsViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

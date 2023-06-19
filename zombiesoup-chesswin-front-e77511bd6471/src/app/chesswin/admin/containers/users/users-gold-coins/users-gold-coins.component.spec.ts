import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UsersGoldCoinsComponent } from './users-gold-coins.component';

describe('UsersGoldCoinsComponent', () => {
	let component: UsersGoldCoinsComponent;
	let fixture: ComponentFixture<UsersGoldCoinsComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ UsersGoldCoinsComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UsersGoldCoinsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

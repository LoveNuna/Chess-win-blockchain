import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UsersGoldCoinsListViewComponent } from './users-gold-coins-list-view.component';

describe('UsersGoldCoinsListViewComponent', () => {
	let component: UsersGoldCoinsListViewComponent;
	let fixture: ComponentFixture<UsersGoldCoinsListViewComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ UsersGoldCoinsListViewComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UsersGoldCoinsListViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

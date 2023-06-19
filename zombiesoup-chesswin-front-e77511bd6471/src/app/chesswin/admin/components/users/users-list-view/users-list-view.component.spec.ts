import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UsersListViewComponent } from './users-list-view.component';

describe('UsersListViewComponent', () => {
	let component: UsersListViewComponent;
	let fixture: ComponentFixture<UsersListViewComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ UsersListViewComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UsersListViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UsersDetailsViewComponent } from './users-details-view.component';

describe('UsersDetailsViewComponent', () => {
	let component: UsersDetailsViewComponent;
	let fixture: ComponentFixture<UsersDetailsViewComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ UsersDetailsViewComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UsersDetailsViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

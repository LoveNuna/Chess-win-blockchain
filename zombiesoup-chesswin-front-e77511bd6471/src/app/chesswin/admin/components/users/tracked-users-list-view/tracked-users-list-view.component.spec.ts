import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TrackedUsersListViewComponent } from './tracked-users-list-view.component';

describe('TrackedUsersListViewComponent', () => {
	let component: TrackedUsersListViewComponent;
	let fixture: ComponentFixture<TrackedUsersListViewComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ TrackedUsersListViewComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TrackedUsersListViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

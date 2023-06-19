import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TrackedUsersComponent } from './tracked-users.component';

describe('TrackedUsersComponent', () => {
	let component: TrackedUsersComponent;
	let fixture: ComponentFixture<TrackedUsersComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ TrackedUsersComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(TrackedUsersComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UserStatusChangeComponent } from './user-status-change.component';

describe('UserStatusChangeComponent', () => {
	let component: UserStatusChangeComponent;
	let fixture: ComponentFixture<UserStatusChangeComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ UserStatusChangeComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UserStatusChangeComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

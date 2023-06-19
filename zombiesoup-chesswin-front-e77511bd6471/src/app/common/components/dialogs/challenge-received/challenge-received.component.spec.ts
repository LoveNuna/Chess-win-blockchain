import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChallengeReceivedComponent } from './challenge-received.component';

describe('ChallengeReceivedComponent', () => {
	let component: ChallengeReceivedComponent;
	let fixture: ComponentFixture<ChallengeReceivedComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ ChallengeReceivedComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ChallengeReceivedComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

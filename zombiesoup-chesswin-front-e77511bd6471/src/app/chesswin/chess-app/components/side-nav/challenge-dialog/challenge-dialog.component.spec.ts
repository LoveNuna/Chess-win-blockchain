import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ChallengeDialogComponent } from './challenge-dialog.component';

describe('ChallengeDialogComponent', () => {
	let component: ChallengeDialogComponent;
	let fixture: ComponentFixture<ChallengeDialogComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ ChallengeDialogComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ChallengeDialogComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

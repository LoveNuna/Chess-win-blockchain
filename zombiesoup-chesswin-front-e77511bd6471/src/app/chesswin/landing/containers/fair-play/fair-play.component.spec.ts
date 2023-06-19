import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FairPlayComponent } from './fair-play.component';

describe('FairPlayComponent', () => {
	let component: FairPlayComponent;
	let fixture: ComponentFixture<FairPlayComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ FairPlayComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FairPlayComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

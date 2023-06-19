import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FairPlayViewComponent } from './fair-play-view.component';

describe('FairPlayViewComponent', () => {
	let component: FairPlayViewComponent;
	let fixture: ComponentFixture<FairPlayViewComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ FairPlayViewComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FairPlayViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

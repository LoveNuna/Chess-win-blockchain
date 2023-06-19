import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HowToViewComponent } from './how-to-view.component';

describe('HowToViewComponent', () => {
	let component: HowToViewComponent;
	let fixture: ComponentFixture<HowToViewComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ HowToViewComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HowToViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

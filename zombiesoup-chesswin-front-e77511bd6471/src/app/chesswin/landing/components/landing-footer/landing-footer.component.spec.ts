import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LandingFooterComponent } from './landing-footer.component';

describe('LandingFooterComponent', () => {
	let component: LandingFooterComponent;
	let fixture: ComponentFixture<LandingFooterComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ LandingFooterComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(LandingFooterComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

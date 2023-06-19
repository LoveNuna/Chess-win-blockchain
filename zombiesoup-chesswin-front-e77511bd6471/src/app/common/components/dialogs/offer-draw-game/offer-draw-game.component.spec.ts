import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { OfferDrawGameComponent } from './offer-draw-game.component';

describe('OfferDrawGameComponent', () => {
	let component: OfferDrawGameComponent;
	let fixture: ComponentFixture<OfferDrawGameComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ OfferDrawGameComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(OfferDrawGameComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

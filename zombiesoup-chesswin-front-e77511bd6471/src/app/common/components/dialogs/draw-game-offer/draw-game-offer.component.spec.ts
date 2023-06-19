import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { DrawGameOfferComponent } from './draw-game-offer.component';

describe('DrawGameOfferComponent', () => {
	let component: DrawGameOfferComponent;
	let fixture: ComponentFixture<DrawGameOfferComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ DrawGameOfferComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(DrawGameOfferComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

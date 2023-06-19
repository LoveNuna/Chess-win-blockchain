import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GameViewComponent } from './game-view.component';

describe('GameViewComponent', () => {
	let component: GameViewComponent;
	let fixture: ComponentFixture<GameViewComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ GameViewComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(GameViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

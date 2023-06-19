import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { GameAbandonedComponent } from './game-abandoned.component';

describe('GameAbandonedComponent', () => {
	let component: GameAbandonedComponent;
	let fixture: ComponentFixture<GameAbandonedComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ GameAbandonedComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(GameAbandonedComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

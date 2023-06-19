import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { AbandonGameComponent } from './abandon-game.component';

describe('AbandonGameComponent', () => {
	let component: AbandonGameComponent;
	let fixture: ComponentFixture<AbandonGameComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ AbandonGameComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(AbandonGameComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

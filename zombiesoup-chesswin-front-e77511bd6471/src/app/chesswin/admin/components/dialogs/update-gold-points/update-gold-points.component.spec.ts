import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { UpdateGoldPointsComponent } from './update-gold-points.component';

describe('UpdateGoldPointsComponent', () => {
	let component: UpdateGoldPointsComponent;
	let fixture: ComponentFixture<UpdateGoldPointsComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ UpdateGoldPointsComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(UpdateGoldPointsComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

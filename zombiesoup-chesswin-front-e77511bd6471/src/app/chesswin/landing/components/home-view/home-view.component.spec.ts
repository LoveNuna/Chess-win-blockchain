import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { HomeViewComponent } from './home-view.component';

describe('HomeViewComponent', () => {
	let component: HomeViewComponent;
	let fixture: ComponentFixture<HomeViewComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ HomeViewComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(HomeViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

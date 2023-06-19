import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ConvertToCashViewComponent } from './convert-to-cash-view.component';

describe('ConvertToCashViewComponent', () => {
	let component: ConvertToCashViewComponent;
	let fixture: ComponentFixture<ConvertToCashViewComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ ConvertToCashViewComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(ConvertToCashViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

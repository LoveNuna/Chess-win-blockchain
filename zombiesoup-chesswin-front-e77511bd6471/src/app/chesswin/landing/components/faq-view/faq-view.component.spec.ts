import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { FaqViewComponent } from './faq-view.component';

describe('FaqViewComponent', () => {
	let component: FaqViewComponent;
	let fixture: ComponentFixture<FaqViewComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ FaqViewComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(FaqViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

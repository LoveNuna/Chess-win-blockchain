import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MobileBannerComponent } from './mobile-banner.component';

describe('MobileBannerComponent', () => {
	let component: MobileBannerComponent;
	let fixture: ComponentFixture<MobileBannerComponent>;

	beforeEach(async () => {
		await TestBed.configureTestingModule({
			declarations: [ MobileBannerComponent ]
		})
			.compileComponents();
	});

	beforeEach(() => {
		fixture = TestBed.createComponent(MobileBannerComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

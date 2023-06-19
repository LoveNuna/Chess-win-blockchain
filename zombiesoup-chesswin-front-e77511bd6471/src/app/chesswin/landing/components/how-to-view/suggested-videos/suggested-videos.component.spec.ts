import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SuggestedVideosComponent } from './suggested-videos.component';

describe('SuggestedVideosComponent', () => {
	let component: SuggestedVideosComponent;
	let fixture: ComponentFixture<SuggestedVideosComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ SuggestedVideosComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(SuggestedVideosComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { MessagesViewComponent } from './messages-view.component';

describe('MessagesViewComponent', () => {
	let component: MessagesViewComponent;
	let fixture: ComponentFixture<MessagesViewComponent>;

	beforeEach(waitForAsync(() => {
		TestBed.configureTestingModule({
			declarations: [ MessagesViewComponent ]
		})
			.compileComponents();
	}));

	beforeEach(() => {
		fixture = TestBed.createComponent(MessagesViewComponent);
		component = fixture.componentInstance;
		fixture.detectChanges();
	});

	it('should create', () => {
		expect(component).toBeTruthy();
	});
});

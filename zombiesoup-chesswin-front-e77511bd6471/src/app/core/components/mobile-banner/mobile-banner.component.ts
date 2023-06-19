import { Component, Input, OnInit } from '@angular/core';

@Component({
	selector: 'app-mobile-banner',
	templateUrl: './mobile-banner.component.html',
	styleUrls: ['./mobile-banner.component.scss']
})
export class MobileBannerComponent implements OnInit {
	@Input() url: string = null;

	constructor() { }

	ngOnInit(): void {
	}

}

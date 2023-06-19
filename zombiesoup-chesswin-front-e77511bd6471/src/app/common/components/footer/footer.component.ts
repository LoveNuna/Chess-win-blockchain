import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
	selector: 'app-footer',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './footer.component.html',
	styleUrls: ['./footer.component.scss']
})
export class FooterComponent {}

import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
	selector: 'app-fair-play-view',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './fair-play-view.component.html',
	styleUrls: ['./fair-play-view.component.scss']
})
export class FairPlayViewComponent {
	@Input() languageLabels: any;
}

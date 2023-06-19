import { Component, ChangeDetectionStrategy, Input } from '@angular/core';

@Component({
	selector: 'app-loading',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './loading.component.html',
	styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
	@Input() size: number;
}

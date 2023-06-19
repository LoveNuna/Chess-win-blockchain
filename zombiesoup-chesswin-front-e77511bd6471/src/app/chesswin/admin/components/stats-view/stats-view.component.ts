import { Component, Input } from '@angular/core';
import { StatsData } from '../../../../common/models/stats-data';

@Component({
	selector: 'app-stats-view',
	templateUrl: './stats-view.component.html',
	styleUrls: ['./stats-view.component.scss']
})
export class StatsViewComponent {
	@Input() title: string = null;
	@Input() stats: StatsData[] = [];
}
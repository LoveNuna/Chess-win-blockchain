import { Component, OnInit } from '@angular/core';

// services
import { FacadeService } from 'facade-service';
import { StatsData } from '../../../../common/models/stats-data';
@Component({
	selector: 'app-dashboard',
	templateUrl: './dashboard.component.html',
	styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
	dashboardData: StatsData[];

	constructor(private facadeService: FacadeService) {}

	ngOnInit() {
		this.facadeService.getDashboardData().then(data => (this.buildStatsData(data)));
	}

	buildStatsData(data: any) {
		this.dashboardData = [];
		
		this.dashboardData.push({
			title: 'Gold Coins',
			classModifier: 'gold-coins',
			data: [{
				value: data.dailyData.commissions,
				name: 'Today'
			},
			{
				value: data.weeklyData.commissions,
				name: 'This Week'
			},
			{
				value: data.monthlyData.commissions,
				name: 'This Month'
			}]
		});

		this.dashboardData.push({
			title: 'Games',
			classModifier: 'games',
			data: [{
				value: data.dailyData.games,
				name: 'Today'
			},
			{
				value: data.weeklyData.games,
				name: 'This Week'
			},
			{
				value: data.monthlyData.games,
				name: 'This Month'
			}]
		});

		this.dashboardData.push({
			title: 'Users',
			classModifier: 'users',
			data: [{
				value: data.dailyData.players,
				name: 'Today'
			},
			{
				value: data.weeklyData.players,
				name: 'This Week'
			},
			{
				value: data.monthlyData.players,
				name: 'This Month'
			}]
		});
	}
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// services
import { FacadeService } from 'facade-service';
import { StatsData } from 'src/app/common/models/stats-data';

@Component({
	selector: 'app-users-gold-coins',
	templateUrl: './users-gold-coins.component.html',
	styleUrls: ['./users-gold-coins.component.scss']
})
export class UsersGoldCoinsComponent implements OnInit {
	users: any[];
	usersToShow: any[];

	usersPerPage = 10;
	pagesToShow = 5;

	startIndex = 0;
	limit = 10;

	weekMonth = 'week';

	requesting = false;

	goldCoinsData: StatsData[];

	constructor(private facadeService: FacadeService, private router: Router) {}

	ngOnInit() {
		this.facadeService.getUsersGoldCoins(this.weekMonth).then((data: any) => {
			if (data && data.length) {
				this.users = data;
				this.filterUsersPerPage(1);
			} else {
				this.users = [];
				this.usersToShow = [];
			}
		});

		this.facadeService.getGoldCoinsData().then((data: any) =>  this.buildGoldCoinsData(data));
	}

	buildGoldCoinsData(data: any) {
		this.goldCoinsData = [];
		
		this.goldCoinsData.push({
			title: 'Gold Coins',
			classModifier: 'gold-coins',
			data: [{
				value: data.thisWeek,
				name: 'This Week'
			},
			{
				value: data.thisMonth,
				name: 'This Month'
			},
			{
				value: data.total,
				name: 'Total'
			}]
		});
	}

	filterUsers(filterValue: string) {
		this.requesting = true;

		this.weekMonth = filterValue;

		this.facadeService.getUsersGoldCoins(this.weekMonth).then((data: any) => {
			if (data && data.length) {
				this.users = data;

				this.filterUsersPerPage(1);
			} else {
				this.users = [];
				this.usersToShow = [];
			}

			this.requesting = false;
		});
	}

	filterUsersPerPage(page: number) {
		if (this.users && this.users.length) {
			this.usersToShow = this.users.slice((page - 1) * this.limit, (page - 1) * this.limit + this.limit);
		} else {
			this.usersToShow = [];
		}
	}

	navigateToUser(user: any) {
		this.router.navigate([`/admin/user/${user.id}`]);
	}
}

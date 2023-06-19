import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// services
import { FacadeService } from 'facade-service';

@Component({
	selector: 'app-tracked-users',
	templateUrl: './tracked-users.component.html',
	styleUrls: ['./tracked-users.component.scss']
})
export class TrackedUsersComponent implements OnInit {
	users: any[];
	usersToShow: any[];

	usersPerPage = 10;
	pagesToShow = 5;

	startIndex = 0;
	limit = 10;

	numberOfDays = 10;

	requesting = false;

	constructor(private facadeService: FacadeService, private router: Router) {}

	ngOnInit() {
		this.facadeService.getTrackedUsers(this.numberOfDays).then((data: any) => {
			if (data && data.length) {
				this.users = data;
				this.filterUsersPerPage(1);
			} else {
				this.users = [];
				this.usersToShow = [];
			}
		});
	}

	filterUsers(filterValue: number) {
		this.requesting = true;

		this.numberOfDays = filterValue;

		this.users = [];
		this.usersToShow = [];

		this.facadeService.getTrackedUsers(this.numberOfDays).then((data: any) => {
			if (data && data.length) {
				this.users = data;

				this.filterUsersPerPage(1);
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
		this.router.navigate([`/admin/user/${user.player_id}`]);
	}
}

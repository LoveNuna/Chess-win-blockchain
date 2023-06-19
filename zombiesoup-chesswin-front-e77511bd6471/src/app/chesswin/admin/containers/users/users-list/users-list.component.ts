import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// services
import { FacadeService } from 'facade-service';

@Component({
	selector: 'app-users-list',
	templateUrl: './users-list.component.html',
	styleUrls: ['./users-list.component.scss'],
})
export class UsersListComponent implements OnInit {
	users: any[];

	usersPerPage = 10;
	pagesToShow = 5;

	startIndex = 0;
	limit = 10;
	filter = '';

	totalUsers: number;

	requesting = false;

	constructor(private facadeService: FacadeService, private router: Router) {}

	ngOnInit() {
		this.facadeService
			.getUsers(this.startIndex, this.limit, this.filter)
			.then((data: any) => {
				if (data && data.payload && data.payload.length) {
					this.users = data.payload;

					this.totalUsers = data.payload[0].totalCount;
				} else {
					this.users = [];
					this.totalUsers = 0;
				}
			});
	}

	filterUsers(filterValue: string) {
		this.requesting = true;

		this.startIndex = 0;
		this.filter = filterValue;

		this.facadeService
			.getUsers(this.startIndex, this.limit, this.filter)
			.then((data: any) => {
				if (data && data.payload && data.payload.length) {
					this.users = data.payload;

					this.totalUsers = data.payload[0].totalCount;
				} else {
					this.users = [];
					this.totalUsers = 0;
				}

				this.requesting = false;
			});
	}

	filterUsersPerPage(page: number) {
		this.requesting = true;

		this.startIndex = (page - 1) * 10;

		this.facadeService
			.getUsers(this.startIndex, this.limit, this.filter)
			.then((data: any) => {
				this.users = data.payload;

				this.requesting = false;
			});
	}

	navigateToUser(user: any) {
		this.router.navigate([`/admin/user/${user.id}`]);
	}
}

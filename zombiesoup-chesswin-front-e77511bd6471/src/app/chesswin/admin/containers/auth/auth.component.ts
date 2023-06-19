import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

// services
import { FacadeService } from 'facade-service';

import { environment } from '../../../../../environments/environment';

@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
	requesting = false;
	serverError = '';

	constructor(private facadeService: FacadeService, private router: Router) {}

	ngOnInit() {
		const credentials = JSON.parse(localStorage.getItem('credentials'));

		if (credentials) {
			this.router.navigate(['/admin/dashboard']);
		}
	}

	login(credentials: any) {
		this.serverError = '';

		if (credentials.username === environment.admin.username && credentials.password === environment.admin.password) {
			this.facadeService.adminLogin(credentials);

			this.router.navigate(['/admin/dashboard']);
		} else {
			this.serverError = 'Credentials do not match!';
		}
	}
}

import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

// rxjs
import { BehaviorSubject } from 'rxjs';

// services
import { FacadeService } from 'facade-service';

import { environment } from '../../../../../environments/environment';

@Component({
	selector: 'app-admin',
	templateUrl: './admin.component.html',
	styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
	adminLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

	requesting = false;
	serverError = '';
	sidenavOpen = false;

	constructor(private facadeService: FacadeService, private router: Router, private breakpointObserver: BreakpointObserver) {}

	ngOnInit() {
		this.adminLoggedIn = this.facadeService.adminLoggedIn;

		const credentials = JSON.parse(localStorage.getItem('credentials'));

		if (credentials && credentials.username === environment.admin.username && credentials.password === environment.admin.password) {
			this.facadeService.adminLogin(credentials);
		}

		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				this.sidenavOpen = false;
			}
		});

		this.breakpointObserver.observe(['(max-width: 1024px)']).subscribe((state: BreakpointState) => {
			if (!state.matches) {
				this.sidenavOpen = false;
			}
		});
	}

	toggleSidenav() {
		this.sidenavOpen = !this.sidenavOpen;
	}

	signout() {
		this.facadeService.adminSignout();
		this.router.navigate(['/']);
	}
}

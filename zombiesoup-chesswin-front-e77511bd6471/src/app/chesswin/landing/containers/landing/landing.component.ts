import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';

// services
import { FacadeService } from 'facade-service';
import { CookieService } from 'ngx-cookie-service';

// functions
import { getErrorFromCode } from '../../../../common/functions/auth-errors';

// constants
import { languages } from '../../../../common/constants/languages';

@Component({
	selector: 'app-landing',
	templateUrl: './landing.component.html',
	styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
	requesting = false;
	serverError = '';
	sidenavOpen = false;

	constructor(
		private facadeService: FacadeService,
		private cookieService: CookieService,
		private router: Router,
		private breakpointObserver: BreakpointObserver
	) {}

	languagesDropdownOpen = false;
	selectedLanguageId: string;
	selectedLanguage: string;
	selectedFlag: string;
	languageLabels;

	languages = languages;

	ngOnInit() {
		const languageId = this.cookieService.get('language');

		this.languages.map(item => {
			if (item.id === languageId) {
				this.selectedLanguageId = item.id;
				this.selectedFlag = item.flag;
				this.selectedLanguage = item.name;
			}
		});

		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				this.sidenavOpen = false;
			}
		});

		this.breakpointObserver.observe(['(max-width: 768px)']).subscribe((state: BreakpointState) => {
			if (!state.matches) {
				this.sidenavOpen = false;
			}
		});
	}

	toggleDropdownOpen() {
		this.languagesDropdownOpen = !this.languagesDropdownOpen;
	}

	changeSelectedLanguage(id, flag, name) {
		this.languagesDropdownOpen = false;
		this.selectedLanguageId = id;
		this.selectedFlag = flag;
		this.selectedLanguage = name;

		this.setLanguage(id);
	}

	setLanguage(languageId) {
		this.facadeService.setLanguage(languageId);
	}

	async login(userCredentials) {
		this.requesting = true;
		this.serverError = '';

		try {
			await this.facadeService.login(userCredentials.email, userCredentials.password);

			this.router.navigate(['/app']);

			this.requesting = false;
		} catch (error) {
			this.serverError = getErrorFromCode(error.code);

			this.requesting = false;
		}
	}

	toggleSidenav() {
		this.sidenavOpen = !this.sidenavOpen;
	}
}

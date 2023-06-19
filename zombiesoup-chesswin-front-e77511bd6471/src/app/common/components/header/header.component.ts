import { Component, ChangeDetectionStrategy, OnInit, Input, Output, EventEmitter } from '@angular/core';

// services
import { CookieService } from 'ngx-cookie-service';

// constants
import { languages } from '../../constants/languages';

@Component({
	selector: 'app-header',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
	@Input() sidenavOpened: boolean;

	@Output() toggleSidenavEmitter: EventEmitter<any> = new EventEmitter<any>();
	@Output() changeLanguageEmitter: EventEmitter<string> = new EventEmitter<string>();

	languagesDropdownOpen = false;
	selectedLanguageId: string;
	selectedLanguage: string;
	selectedFlag: string;
	languageLabels;

	languages = languages;

	constructor(private cookieService: CookieService) {}

	ngOnInit() {
		const languageId = this.cookieService.get('language');

		this.languages.map(item => {
			if (item.id === languageId) {
				this.selectedLanguageId = item.id;
				this.selectedFlag = item.flag;
				this.selectedLanguage = item.name;
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

		this.changeLanguageEmitter.emit(id);
	}

	toggleSidenav() {
		this.toggleSidenavEmitter.emit();
	}
}

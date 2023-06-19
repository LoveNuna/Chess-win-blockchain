import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

// rxjs
import { BehaviorSubject } from 'rxjs';

// services
import { CookieService } from 'ngx-cookie-service';

@Injectable()
export class LanguageService {
	languageLabels: BehaviorSubject<any> = new BehaviorSubject<any>(null);
	
	constructor(private cookieService: CookieService, private http: HttpClient) {}
	
	async setLanguage(languageId: string) {
		const updatedLanguageLabels = await this.http.get(`/assets/languages/${languageId}.json`).toPromise();
		
		this.cookieService.set('language', languageId);
		
		this.languageLabels.next(updatedLanguageLabels);
	}
  
	getLanguageLabels() {
		return this.languageLabels;
	}
}

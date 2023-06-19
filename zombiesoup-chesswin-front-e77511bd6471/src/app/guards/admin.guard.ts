import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';

// rxjs
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';

@Injectable()
export class AdminGuard implements CanActivate {
	constructor(private router: Router) {}

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		const credentials = JSON.parse(localStorage.getItem('credentials'));

		if (credentials && credentials.username === environment.admin.username && credentials.password === environment.admin.password) {
			return true;
		} else {
			this.router.navigate(['/admin/auth']);
		}
	}
}

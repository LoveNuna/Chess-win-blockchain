import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

// rxjs
import { map } from 'rxjs/operators';

// services
import { FacadeService } from 'facade-service';

@Injectable()
export class HomeGuard implements CanActivate {
	constructor(private facadeService: FacadeService, private router: Router) {}

	canActivate() {
		return this.facadeService.user.pipe(
			map(user => {
				if (user) {
					this.router.navigate(['/app']);
				}

				return true;
			})
		);
	}
}

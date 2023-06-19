import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, CanDeactivate } from '@angular/router';

// rxjs
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

// services
import { FacadeService } from 'facade-service';

@Injectable()
export class GameGuard implements CanActivate {
	constructor(private facadeService: FacadeService, private router: Router) {}

	canActivate(
		next: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		return this.facadeService.game.pipe(
			map(game => {
				if (game) {
					return true;
				}

				this.router.navigate(['/app']);
			})
		);
	}

	canDeactivate(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
		return this.facadeService.game.pipe(
			map((game: any) => {
				if (game) {
					if (confirm('Are you sure you want to leave this page? You will automatically lose the game if you do so!')) {
						this.facadeService.abortGameLambda(game.id, this.facadeService.user.getValue().sub).then(() => {
							this.facadeService.unsubscribeGameLambda(game.id, this.facadeService.connectionId.getValue().id).then(() => {
								this.facadeService.chatMessage.next(null);
								this.facadeService.game.next(null);
								localStorage.removeItem('game');
								localStorage.removeItem('gameId');
							});
						});
					}
				}

				return true;
			})
		);
	}
}

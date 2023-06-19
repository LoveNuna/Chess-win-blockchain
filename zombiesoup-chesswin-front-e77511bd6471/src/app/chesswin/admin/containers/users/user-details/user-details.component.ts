import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

// rxjs
import { BehaviorSubject, of, forkJoin } from 'rxjs';
import { switchMap } from 'rxjs/operators';

// services
import { FacadeService } from 'facade-service';

// dialogs
import { UserStatusChangeComponent } from '../../../components/dialogs/user-status-change/user-status-change.component';
import { UpdateGoldPointsComponent } from '../../../components/dialogs/update-gold-points/update-gold-points.component';

@Component({
	selector: 'app-user-details',
	templateUrl: './user-details.component.html',
	styleUrls: ['./user-details.component.scss']
})
export class UserDetailsComponent implements OnInit {
	user: BehaviorSubject<any> = new BehaviorSubject<any>(null);
	userGameHistory: BehaviorSubject<any[]> = new BehaviorSubject<any[]>(null);

	requesting: boolean;

	constructor(private facadeService: FacadeService, private dialog: MatDialog, private route: ActivatedRoute) {}

	ngOnInit() {
		this.route.paramMap
			.pipe(
				switchMap(params => {
					if (params.get('userId')) {
						return forkJoin(this.facadeService.getUserCognito(params.get('userId')), this.facadeService.getUserStats(params.get('userId')));
					}

					return of(null);
				})
			)
			.subscribe(data => {
				const [userData, userGameHistory] = data;

				let user;

				userData.UserAttributes.map(item => {
					user = { ...user, [`${item.Name}`]: item.Value };
				});

				const dateDifference = new Date().getTime() - new Date(user.birthdate).getTime();
				const ageDate = new Date(dateDifference);

				user = { ...user, age: Math.abs(ageDate.getUTCFullYear() - 1970), enabled: userData.Enabled };

				this.user.next(user);
				this.userGameHistory.next(userGameHistory);
			});
	}

	changeUserStatus(data: { email: string; status: boolean }) {
		const disableUserDialog = this.dialog.open(UserStatusChangeComponent, {
			width: '500px',
			panelClass: 'challenge-dialog',
			data: {
				disableUser: !data.status
			}
		});

		disableUserDialog.afterClosed().subscribe(async dialogData => {
			this.requesting = true;

			if (dialogData) {
				this.facadeService.openSimpleSnackbar(`${data.status ? 'Enabling user...' : 'Disabling user...'}`);

				try {
					if (status) {
						await this.facadeService.enableUser(data.email);
					} else {
						await this.facadeService.disableUser(data.email);
					}

					let updatedUser = this.user.getValue();

					updatedUser = { ...updatedUser, enabled: data.status };

					this.user.next(updatedUser);

					this.facadeService.openSnackbarWithDismiss(`${data.status ? 'User enabled.' : 'User disabled.'}`, 5000);

					this.requesting = false;
				} catch (error) {
					this.facadeService.openSnackbarWithDismiss('An error occurred!', 5000);

					this.requesting = false;
				}
			}
		});
	}

	updateUserGoldCoins(goldPoints: number) {
		const updatePointsDialog = this.dialog.open(UpdateGoldPointsComponent, {
			width: '500px',
			panelClass: 'challenge-dialog',
			data: { goldPoints }
		});

		updatePointsDialog.afterClosed().subscribe(async data => {
			if (data && data.accepted) {
				this.facadeService.openSimpleSnackbar('Updating user gold points...');

				try {
					await this.facadeService.updateUserPoints(this.user.getValue().sub, data.points);

					const user = { ...this.user.getValue(), ['custom:gold_points']: data.points };

					this.user.next(user);

					this.facadeService.openSnackbarWithTimer('User gold points updated!', 3000);
				} catch (error) {
					this.facadeService.openSnackbarWithDismiss('An error occurred!', 5000);
				}
			}
		});
	}
}

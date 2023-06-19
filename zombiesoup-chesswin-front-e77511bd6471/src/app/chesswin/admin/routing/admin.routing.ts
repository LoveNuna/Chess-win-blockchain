import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// guards
import { AdminGuard } from 'src/app/guards/admin.guard';

// containers
import { AdminComponent } from '../containers/admin/admin.component';
import { AuthComponent } from '../containers/auth/auth.component';
import { DashboardComponent } from '../containers/dashboard/dashboard.component';
import { WithdrawalsComponent } from '../containers/withdrawals/withdrawals.component';
import { TrackedUsersComponent } from '../containers/users/tracked-users/tracked-users.component';
import { UserDetailsComponent } from '../containers/users/user-details/user-details.component';
import { UsersGoldCoinsComponent } from '../containers/users/users-gold-coins/users-gold-coins.component';
import { UsersListComponent } from '../containers/users/users-list/users-list.component';

const routes: Routes = [
	{
		path: '',
		component: AdminComponent,
		children: [
			{
				path: 'auth',
				component: AuthComponent
			},
			{
				path: 'dashboard',
				component: DashboardComponent,
				canActivate: [AdminGuard]
			},
			{
				path: 'users',
				component: UsersListComponent,
				canActivate: [AdminGuard]
			},
			{
				path: 'user/:userId',
				component: UserDetailsComponent,
				canActivate: [AdminGuard]
			},
			{
				path: 'tracked-users',
				component: TrackedUsersComponent,
				canActivate: [AdminGuard]
			},
			{
				path: 'users-gold-coins',
				component: UsersGoldCoinsComponent,
				canActivate: [AdminGuard]
			},
			{
				path: 'withdrawals',
				component: WithdrawalsComponent,
				canActivate: [AdminGuard]
			},
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'auth'
			}
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AdminRouting {}

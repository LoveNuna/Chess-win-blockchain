import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// modules
import { CommonModule } from 'common-module';

// routing
import { AdminRouting } from './routing/admin.routing';

// containers
import { AdminComponent } from './containers/admin/admin.component';
import { AuthComponent } from './containers/auth/auth.component';
import { DashboardComponent } from './containers/dashboard/dashboard.component';
import { WithdrawalsComponent } from './containers/withdrawals/withdrawals.component';
import { TrackedUsersComponent } from './containers/users/tracked-users/tracked-users.component';
import { UserDetailsComponent } from './containers/users/user-details/user-details.component';
import { UsersGoldCoinsComponent } from './containers/users/users-gold-coins/users-gold-coins.component';
import { UsersListComponent } from './containers/users/users-list/users-list.component';

// components
import { AuthFormComponent } from './components/auth-form/auth-form.component';
import { WithdrawalsViewComponent } from './components/withdrawals-view/withdrawals-view.component';
import { TrackedUsersListViewComponent } from './components/users/tracked-users-list-view/tracked-users-list-view.component';
import { UsersDetailsViewComponent } from './components/users/users-details-view/users-details-view.component';
import { UsersGoldCoinsListViewComponent } from './components/users/users-gold-coins-list-view/users-gold-coins-list-view.component';
import { UsersListViewComponent } from './components/users/users-list-view/users-list-view.component';

// dialogs
import { UpdateGoldPointsComponent } from './components/dialogs/update-gold-points/update-gold-points.component';
import { UserStatusChangeComponent } from './components/dialogs/user-status-change/user-status-change.component';
import { StatsViewComponent } from './components/stats-view/stats-view.component';

@NgModule({
	declarations: [
		// containers
		AdminComponent,
		AuthComponent,
		DashboardComponent,
		WithdrawalsComponent,
		TrackedUsersComponent,
		UserDetailsComponent,
		UsersGoldCoinsComponent,
		UsersListComponent,
		// components
		AuthFormComponent,
		WithdrawalsViewComponent,
		TrackedUsersListViewComponent,
		UsersDetailsViewComponent,
		UsersGoldCoinsListViewComponent,
		UsersListViewComponent,
		// dialogs
		UpdateGoldPointsComponent,
		UserStatusChangeComponent,
		StatsViewComponent
	],
	imports: [CommonModule, FormsModule, ReactiveFormsModule, AdminRouting],
	entryComponents: [UpdateGoldPointsComponent, UserStatusChangeComponent]
})
export class AdminModule {}

import { Component, OnInit } from '@angular/core';

// services
import { FacadeService } from 'facade-service';
import { StatsData } from 'src/app/common/models/stats-data';

@Component({
	selector: 'app-withdrawals',
	templateUrl: './withdrawals.component.html',
	styleUrls: ['./withdrawals.component.scss']
})
export class WithdrawalsComponent implements OnInit {
	withdrawals: any[];
	withdrawalsToShow: any[];

	withdrawalsPerPage = 10;
	pagesToShow = 5;

	startIndex = 0;
	limit = 10;

	weekMonth = 'week';

	requesting = false;

	withdrawalData: StatsData[];

	constructor(private facadeService: FacadeService) {}

	ngOnInit() {
		this.facadeService.getUserWithdrawals().then((data: any) => {
			if (data && data.length) {
				this.withdrawals = data;

				this.filterWithdrawalsPerPage(1);
			} else {
				this.withdrawals = [];
				this.withdrawalsToShow = [];
			}
		});
		
		this.facadeService.getWithdrawalData().then((data: any) =>  this.buildWithdrawalData(data));
	}

	buildWithdrawalData(data: any) {
		this.withdrawalData = [];
		
		this.withdrawalData.push({
			title: 'Withdrawal Stats',
			classModifier: 'gold-coins',
			data: [{
				value: data.thisWeek,
				name: 'This Week'
			},
			{
				value: data.thisMonth,
				name: 'This Month'
			},
			{
				value: data.total,
				name: 'Total'
			}]
		});
	}

	filterWithdrawals(filterValue: string) {
		this.requesting = true;

		this.weekMonth = filterValue;

		this.facadeService.getUsersGoldCoins(this.weekMonth).then((data: any) => {
			if (data && data.length) {
				this.withdrawals = data;

				this.filterWithdrawalsPerPage(1);
			} else {
				this.withdrawals = [];
				this.withdrawalsToShow = [];
			}

			this.requesting = false;
		});
	}

	get sortData() {
		return this.withdrawals.sort((a, b) => {
			return (
				<any>new Date(b.draw_change_date) - <any>new Date(a.draw_change_date)
			);
		});
	}

	filterWithdrawalsPerPage(page: number) {
		if (this.withdrawals && this.withdrawals.length) {
			this.withdrawalsToShow = this.sortData.slice(
				(page - 1) * this.limit,
				(page - 1) * this.limit + this.limit
			);
		} else {
			this.withdrawalsToShow = [];
		}
	}

	async handleWithdrawalAction(event) {
		this.facadeService.openSimpleSnackbar(
			`${
				event.drawStatus === 1 ? 'Accepting' : 'Rejecting'
			} withdrawal request...`
		);

		try {
			await this.facadeService.updateUserWithdrawalStatus(
				event.drawStatus,
				event.playerId,
				event.drawGoldPoints
			);

			this.withdrawalsToShow = this.withdrawalsToShow.map(item => {
				if (item.id === event.playerId) {
					return { ...item, drawStatus: event.drawStatus };
				}

				return item;
			});

			this.facadeService.openSnackbarWithTimer(
				`Withdrawal request ${
					event.drawStatus === 1 ? 'accepted' : 'rejected'
				}!`,
				3000
			);
		} catch (error) {
			this.facadeService.openSnackbarWithDismiss(error, 5000);
		}
	}
}

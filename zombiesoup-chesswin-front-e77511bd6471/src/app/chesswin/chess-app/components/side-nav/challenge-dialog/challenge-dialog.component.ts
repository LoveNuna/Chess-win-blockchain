import { Component, Inject, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

// constants
import { challengeType } from '../../../../../common/constants/challenge-type';
import { gameTimeTypes } from '../../../../../common/constants/game-time-types';

// interfaces
import { ChallengeDialogData } from '../../../../../common/models/challenge-dialog-data';

// functions
import { getTimeByType } from '../../../../../common/functions/game-timers';

@Component({
	selector: 'app-challenge-dialog',
	templateUrl: './challenge-dialog.component.html',
	styleUrls: ['./challenge-dialog.component.scss'],
})
export class ChallengeDialogComponent {
	@ViewChild('gameChallengeAmmountSelector')
	gameChallengeAmmountSelector;
	@ViewChild('gameChallengeTimerSelector', { static: true })
	gameChallengeTimerSelector;

	challengeType = challengeType;
	gameTimeTypes = gameTimeTypes;

	gameChallengeType: challengeType;
	gameFairPlay = true;
	gameChallengeAmmount = 5;
	gameChallengeTimeType = 1;
	gameChallengeTime = getTimeByType(this.gameChallengeTimeType);

	gameChallengeCoins = [5, 10, 50, 100, 500, 1000];

	constructor(
		public dialogRef: MatDialogRef<ChallengeDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public dialogData: ChallengeDialogData | any
	) {
		this.gameChallengeType = dialogData.challengeType;
	}

	handleGameTypeChange(gameType: challengeType) {
		this.gameChallengeType = gameType;

		if (this.gameChallengeType === challengeType.gold) {
			this.gameChallengeAmmount = 5;
		} else {
			this.gameChallengeAmmount = 0;
		}
	}

	handleGameChallengeAmmountSelector() {
		this.gameChallengeAmmountSelector.open();
	}

	updateGameChallengeCoins(event) {
		this.gameChallengeAmmount = event.value;
	}

	handleGameChallengeTimerSelector(event) {
		this.gameChallengeTimerSelector.open();
	}

	updateGameChallengeTime(event) {
		this.gameChallengeTimeType = event.value;
		this.gameChallengeTime = getTimeByType(event.value);
	}

	sendChallenge() {
		const gameData = {
			...this.dialogData,
			challengeType: this.gameChallengeType,
			fairPlay: this.gameFairPlay,
			challengeAmmount: this.gameChallengeAmmount,
			challengeTime: this.gameChallengeTimeType,
		};

		this.dialogRef.close(gameData);
	}
}

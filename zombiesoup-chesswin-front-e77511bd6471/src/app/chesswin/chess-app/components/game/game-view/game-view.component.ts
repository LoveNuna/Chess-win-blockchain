import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit } from '@angular/core';

// rxjs
import { BehaviorSubject } from 'rxjs';
import { filter, take } from 'rxjs/operators';

// game data
import { blackTime, whiteTime, userSide, gameHistory, whitePiecesTaken, blackPiecesTaken } from '../game-engine/game-data';

@Component({
	selector: 'app-game-view',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './game-view.component.html',
	styleUrls: ['./game-view.component.scss']
})
export class GameViewComponent implements OnInit {
	@Input() game: any;
	@Input() movesHistory: any[];

	@Output() makeMoveEmitter: EventEmitter<any> = new EventEmitter<any>();
	@Output() offerDrawEmitter: EventEmitter<any> = new EventEmitter<any>();
	@Output() abandonGameEmitter: EventEmitter<any> = new EventEmitter<any>();

	userTime: BehaviorSubject<any> = new BehaviorSubject<any>(null);
	opponentTime: BehaviorSubject<any> = new BehaviorSubject<any>(null);
	userPiecesTaken: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);
	opponentPiecesTaken: BehaviorSubject<any[]> = new BehaviorSubject<any[]>([]);

	gameHistory = gameHistory;

	lastMove;
	lastMoveActive = false;

	ngOnInit() {
		userSide
			.pipe(
				filter(item => !!item),
				take(1)
			)
			.subscribe(data => {
				if (data === 'w') {
					this.userTime = whiteTime;
					this.opponentTime = blackTime;
					this.userPiecesTaken = whitePiecesTaken;
					this.opponentPiecesTaken = blackPiecesTaken;
				} else {
					this.userTime = blackTime;
					this.opponentTime = whiteTime;
					this.userPiecesTaken = blackPiecesTaken;
					this.opponentPiecesTaken = whitePiecesTaken;
				}
			});
	}

	emitNewMove(moveData) {
		this.makeMoveEmitter.emit(moveData);
	}

	emitDrawOffer() {
		this.offerDrawEmitter.emit();
	}

	emitAbandonGame() {
		this.abandonGameEmitter.emit();
	}

	getLastMove() {
		if (this.movesHistory && this.movesHistory.length && this.movesHistory.length > 2) {
			if (this.lastMoveActive) {
				this.lastMove = this.movesHistory[this.movesHistory.length - 1].fen;
				this.lastMoveActive = false;
			} else {
				this.lastMove = this.movesHistory[this.movesHistory.length - 2].fen;
				this.lastMoveActive = true;
			}
		}
	}
}

import {
	Component,
	OnInit,
	Input,
	ChangeDetectionStrategy,
	OnChanges,
	SimpleChanges
} from '@angular/core';

// chess
import * as ChessBoard from 'chessboardjs';
import * as Chess from 'chess.js';

// rxjs
import { filter, take } from 'rxjs/operators';

// game data
import { gameHistory } from './game-data';

declare let $: any;

const game = new Chess();
let board = null;
const boardId = '#board1';

const whiteSquareGrey = 'rgba(55,67,95,0.5)';
const blackSquareGrey = 'rgba(55,67,95,0.8)';

const squareClass = 'square-55d63';
let highlightedColorToClear = null;

import { newGameMove, userSide } from './game-data';

@Component({
	selector: 'app-game-engine',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './game-engine.component.html',
	styleUrls: ['./game-engine.component.scss']
})
export class GameEngineComponent implements OnInit, OnChanges {
	@Input() game: any;
	@Input() user: any;
	@Input() lastMove: string;

	config = {
		draggable: true,
		dropOffBoard: 'snapback',
		position: 'start',
		onDragStart: this.onDragStart,
		onDrop: this.onDrop,
		onSnapEnd: this.onSnapEnd,
		pieceTheme: '/assets/icons/chess-icons/{piece}.png',
		orientation: ''
	};

	async ngOnInit() {
		await this.dummyWorkaround();
		newGameMove.subscribe((data) => {
			if (data && data.payload) {
				if (
					data.payload.moveBy &&
					data.payload.moveBy !== this.user.sub
				) {
					const move = game.move({
						from: data.payload.from,
						to: data.payload.to,
						promotion: data.payload.promotion
					});

					handleHighlights(move);

					gameHistory.next(game.history({ verbose: true }));

					board.position(data.payload.fen);
				}
			}
		});

		userSide
			.pipe(
				filter((item) => !!item),
				take(1)
			)
			.subscribe((data) => {
				if (data) {
					this.config = {
						...this.config,
						orientation: data === 'b' ? 'black' : 'white'
					};

					board = ChessBoard('board1', this.config);

					updateStatus();

					document.getElementsByTagName('img')[
						document.getElementsByTagName('img').length - 1
					].style.zIndex = '9999';
				}
			});
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes && changes.lastMove && changes.lastMove.currentValue) {
			board.position(this.lastMove);
		}
	}

	onDragStart(source, piece, position, orientation) {
		// only pick up pieces for the side to move
		const searchRegex = userSide.getValue() === 'b' ? /^w/ : /^b/;
		if (
			(game.turn() === userSide.getValue() &&
				piece.search(searchRegex) !== -1) ||
			game.turn() !== userSide.getValue()
		) {
			return false;
		}

		fillGreySquares(source);
		removeHighlights(highlightedColorToClear);

		// do not pick up pieces if the game is over
		if (game.game_over()) {
			return false;
		}
	}

	onDrop(source, target) {
		removeGreySquares();

		// see if the move is legal
		const move = game.move({
			from: source,
			to: target,
			promotion: 'q' // NOTE: always promote to a queen for example simplicity
		});

		// illegal move
		if (move === null) {
			return 'snapback';
		}

		gameHistory.next(game.history({ verbose: true }));

		newGameMove.next({ move, fen: game.fen() });

		handleHighlights(move);

		updateStatus();
	}

	// update the board position after the piece snap
	// for castling, en passant, pawn promotion
	onSnapEnd() {
		board.position(game.fen());
	}

	async dummyWorkaround() {
		return setTimeout(() => {
			return true;
		}, 500);
	}
}

function updateStatus() {
	let status = '';
	let moveColor = 'White';

	if (game.turn() === 'b') {
		moveColor = 'Black';
	}

	// checkmate?
	if (game.in_checkmate()) {
		status = 'Game over, ' + moveColor + ' is in checkmate.';
	} else if (game.in_draw()) {
		// draw
		status = 'Game over, drawn position';
	} else {
		// game still on
		status = moveColor + ' to move';

		// check?
		if (game.in_check()) {
			status += ', ' + moveColor + ' is in check';
		}
	}
}

function removeGreySquares() {
	$(boardId + ' .square-55d63').css('background', '');
}

function greySquare(square) {
	const $square = $(boardId + ' .square-' + square);

	const background = $square.hasClass('black-3c85d')
		? blackSquareGrey
		: whiteSquareGrey;

	$square.css('background', background);
}

function fillGreySquares(square) {
	// get list of possible moves for this square
	const moves = game.moves({
		square,
		verbose: true
	});

	// exit if there are no moves available for this square
	if (moves.length === 0) {
		return;
	}

	// highlight the square for the piece the drag
	greySquare(square);

	// highlight the possible squares for this piece
	for (const move of moves) {
		greySquare(move.to);
	}
}

function handleHighlights(move) {
	if (move.color === 'w') {
		removeHighlights('white');

		$('#board1')
			.find('.square-' + move.from)
			.addClass('highlight-white');
		$('#board1')
			.find('.square-' + move.to)
			.addClass('highlight-white');

		highlightedColorToClear = 'black';
	} else {
		removeHighlights('black');

		$('#board1')
			.find('.square-' + move.from)
			.addClass('highlight-black');
		$('#board1')
			.find('.square-' + move.to)
			.addClass('highlight-black');

		highlightedColorToClear = 'white';
	}
}

function removeHighlights(color) {
	$('#board1')
		.find('.' + squareClass)
		.removeClass('highlight-' + color);
}

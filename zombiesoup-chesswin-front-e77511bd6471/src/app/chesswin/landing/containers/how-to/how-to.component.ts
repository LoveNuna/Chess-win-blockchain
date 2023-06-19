import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-how-to',
	templateUrl: './how-to.component.html',
	styleUrls: ['./how-to.component.scss']
})
export class HowToComponent implements OnInit {
	selectedVideoObject;
	upNextVideoObject;
	suggestedVideos;

	allVideos = [
		// {
		// 	id: 0,
		// 	thumbnail: 'battle-board-game-chance.jpg',
		// 	title: 'How to Play Chess: The Complete Guide for Beginners',
		// 	embedUrl: `https://www.youtube.com/embed/NAIQyoPcjNM`,
		// 	description: `How to Play Chess. Who doesn't want to be a cool intellectual and play chess like a pro?
		//   This game definitely stands out from everything else and has tons of admirers all over the world.
		//   So do you want to join in and learn the basic rules and even some winning tricks and techniques?
		//   In that case, this video guide is what you’ve been looking for.<br>
		//   To win and become a true chess champion, your task is to checkmate your opponent's king.
		//   It may sound like a piece of cake, but it's way more complicated than you might think!
		//   Checkmate basically means putting the king in a position where he’ll be captured because he can't move or be protected by any other piece.
		//   The more of your opponent's pieces you capture, the easier it'll be to checkmate.
		//   Just don't focus all your energy on this. Your own king should be properly protected at all times so that your opponent can’t get to him.<br><br>
		//   To win and become a true chess champion, your task is to checkmate your opponent's king.
		//   It may sound like a piece of cake, but it's way more complicated than you might think!
		//   Checkmate basically means putting the king in a position where he’ll be captured because he can't move or be protected by any other piece.
		//   The more of your opponent's pieces you capture, the easier it'll be to checkmate. Just don't focus all your energy on this.
		//   Your own king should be properly protected at all times so that your opponent can’t get to him.`
		// },
		// {
		// 	id: 1,
		// 	thumbnail: 'black-and-white-board-game-challenge.jpg',
		// 	title:
		// 		'How to Play Chess: Rules for Beginners: Learn Game Basics, Board Setup, Moves, Castling, En Passant',
		// 	embedUrl: 'https://www.youtube.com/embed/mGuYHXfgDxY',
		// 	description: `Learn How to Play Chess in Just 12 minutes. This is a beginners guide to ALL the Rules of Chess.<br>
		//   Click on the timestamps below to jump directly to a specific topic:<br>
		//   1:02 How to setup the chess board?<br>
		//   1:52 Basics of the game<br>
		//   2:08 How the rook moves?<br>
		//   2:31 How the bishop moves?<br>
		//   2:47 How the queen moves?<br>
		//   3:08 How the knight moves?<br>
		//   3:38 How the pawn moves and captures?<br>
		//   4:51 Pawn promotion<br>
		//   5:18 Game objective/How to win & How the king moves<br>
		//   5:38 What is Check, how to protect your king & what does Checkmate mean?<br>
		//   7:17 What does Stalemate mean?<br>
		//   7:52 Draw by insufficient material<br>
		//   8:11 Draw by 50-Move Rule<br>
		//   8:38 Draw by threefold repetition<br>
		//   9:17 Special Pawn rule - En passant<br>
		//   10:20 Castling - How to castle in chess?<br><br>
		//  If you have any questions, feel free to post them in the comments below. I will be happy to answer & help you out. Let me know in the comments if I have missed out on anything.<br><br>
		//  If you find this video useful, do not forget to Like, Comment & Share. If you want to learn some cool chess tips & tricks and become a better chess player, then Subscribe to my Channel "Chess Talk" by Jeetendra Advani.`
		// },
		// {
		// 	id: 2,
		// 	thumbnail: 'black-and-white-board-game-chess.jpg',
		// 	title: 'How to Play: Chess',
		// 	embedUrl: 'https://www.youtube.com/embed/fKxG8KjH1Qg',
		// 	description: `One of the world's most popular games, played by millions of people worldwide in homes, parks, clubs, online, by correspondence, and in tournaments. In recent years, chess has become part of some school curricula.`
		// },
		// {
		// 	id: 3,
		// 	thumbnail: 'chess-board-sc.png',
		// 	title: 'How to play Chess (Basics)',
		// 	embedUrl: 'https://www.youtube.com/embed/NAIQyoPcjNM',
		// 	description: `Lorem ipsum, or lipsum as it is sometimes known, is dummy text used in laying out print, graphic or web designs…`
		// },
		// {
		// 	id: 4,
		// 	thumbnail: 'black-and-white-board-game-chess.jpg',
		// 	title: 'Top 7 Aggressive Chess Openings',
		// 	embedUrl: 'https://www.youtube.com/embed/Ib8XaRKCAfo',
		// 	description: `Everyone loves an aggressive chess opening so I thought I would create a list of my top 7 aggressive openings.  Enjoy.`
		// }

		{
			id: 0,
			thumbnail: 'battle-board-game-chance.jpg',
			title: 'ChessWin Game Trailer 2020',
			embedUrl: 'https://www.youtube.com/embed/oijYjUi0tPU',
			description: `Play Chess and earn more!
      Play chess by giving you a chance to earn money, reputation, friends and more.`
		},
		{
			id: 1,
			thumbnail: 'black-and-white-board-game-challenge.jpg',
			title: 'ChessWin Game Teaser 02 2020',
			embedUrl: 'https://www.youtube.com/embed/Ikccb_Pr1fQ',
			description: `Chess Win - another level of chess game
      Play with the most intriguing game - chess win.`
		},
		{
			id: 2,
			thumbnail: 'black-and-white-board-game-chess.jpg',
			title: 'ChessWin Game Teaser 01 2020',
			embedUrl: 'https://www.youtube.com/embed/OixK8-urMzs',
			description: `Chess Win - another level of chess game
      Play with the most intriguing game - chess win.`
		},
		{
			id: 3,
			thumbnail: 'Chess4.jpg',
			title: 'ChessWin Know Hows General Animation',
			embedUrl: 'https://www.youtube.com/embed/j6putzoyoZ0',
			description: `How to play chess win
      Get all the instructions you need to install, play and challenge yourself with chess win`
		},
		{
			id: 4,
			thumbnail: 'chess5.jpg',
			title: 'ChessWin Know Hows General Animation 2',
			embedUrl: 'https://www.youtube.com/embed/xy9tnK9Q1-4',
			description: `How to play chess win
      Get all the instructions you need to install, play and challenge yourself with chess win`
		},
		{
			id: 5,
			thumbnail: 'chess6.jpg',
			title: 'ChessWin Know Hows GoldCoinShop',
			embedUrl: 'https://www.youtube.com/embed/LggsZR_V3n4',
			description: `How to get your gold coins
      Learn how to cash out your gold coins`
		}
	];

	ngOnInit() {
		this.filterVideos(this.allVideos);
	}

	filterVideos(allVideos, currentVideoId?) {
		let newCurrentVideoId;
		let randomNumber2;
		if (currentVideoId || currentVideoId === 0) {
			newCurrentVideoId = currentVideoId;
		} else {
			newCurrentVideoId = Math.floor(Math.random() * allVideos.length);
		}
		do {
			randomNumber2 = Math.floor(Math.random() * allVideos.length);
		} while (newCurrentVideoId === randomNumber2);
		this.selectedVideoObject = this.allVideos[newCurrentVideoId];
		this.upNextVideoObject = allVideos[randomNumber2];
		this.suggestedVideos = allVideos.filter(item => {
			return item.id !== newCurrentVideoId && item.id !== randomNumber2;
		});
	}

	changeSelectedVideo(event) {
		if (event) {
			if (event.videoId || event.videoId === 0) {
				this.filterVideos(this.allVideos, event.videoId);
			}
		}
	}
}

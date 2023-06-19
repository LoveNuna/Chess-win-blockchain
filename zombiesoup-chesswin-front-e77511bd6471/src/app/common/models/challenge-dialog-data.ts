import { challengeType } from '../constants/challenge-type';

export interface ChallengeDialogData {
	userId: string;
	userName: string;
	userImage: string;
	userCountry: string;
	opponentId: string;
	opponentImage: string;
	opponentCountry: string;
	opponentName: string;
	opponentNickname: string;
	challengeType?: challengeType;
}

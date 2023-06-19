import {
	Component,
	ChangeDetectionStrategy,
	Input,
	Output,
	EventEmitter
} from '@angular/core';
import { Router } from '@angular/router';

// interfaces
import { User } from '../../../../../common/models/user';

// constants
import { challengeType } from '../../../../../common/constants/challenge-type';

@Component({
	selector: 'app-challenge-view',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './challenge-view.component.html',
	styleUrls: ['./challenge-view.component.scss']
})
export class ChallengeViewComponent {
	@Input() user: User;
	@Input() lookingForChallenge: boolean;

	@Output() challengeTypeEmitter: EventEmitter<any> = new EventEmitter<any>();

	constructor(private router: Router) {}

	challengeType = challengeType;

	emitChallengeType(gameChallengeType: challengeType) {
		this.challengeTypeEmitter.emit(gameChallengeType);
	}

	// navigateToPackages() {
	//   this.router.navigate(['/packages'], { queryParams: { userId: this.user.sub } });
	// }
}

import {
	Component,
	Input,
	Output,
	EventEmitter,
	ChangeDetectionStrategy
} from '@angular/core';

@Component({
	selector: 'app-suggested-videos',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './suggested-videos.component.html',
	styleUrls: ['./suggested-videos.component.scss']
})
export class SuggestedVideosComponent {
	@Input() suggestedVideos;
	@Input() upNextVideoObject;
	@Output() changeVideoEmitter: EventEmitter<any> = new EventEmitter<any>();

	changeSelectedVideo(id) {
		this.changeVideoEmitter.emit({ videoId: id });
	}
}

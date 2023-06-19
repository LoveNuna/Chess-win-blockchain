import {
	Component,
	OnInit,
	Input,
	OnChanges,
	ChangeDetectionStrategy,
	SimpleChanges
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
	selector: 'app-video-player',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './video-player.component.html',
	styleUrls: ['./video-player.component.scss']
})
export class VideoPlayerComponent implements OnInit, OnChanges {
	@Input() selectedVideoObject;
	safeUrl: SafeResourceUrl;

	constructor(private sanitizer: DomSanitizer) {}

	ngOnInit() {}

	sanitizeEmbedUrl() {
		this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
			this.selectedVideoObject.embedUrl + '?autoplay=1'
		);
	}

	ngOnChanges(changes: SimpleChanges) {
		if (changes.selectedVideoObject) {
			this.sanitizeEmbedUrl();
		}
	}
}

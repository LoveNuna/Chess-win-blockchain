import { Component, OnInit } from '@angular/core';

// rxjs
import { BehaviorSubject } from 'rxjs';

// services
import { FacadeService } from 'facade-service';

@Component({
	selector: 'app-fair-play',
	templateUrl: './fair-play.component.html',
	styleUrls: ['./fair-play.component.scss']
})
export class FairPlayComponent implements OnInit {
	languageLabels: BehaviorSubject<any> = new BehaviorSubject<any>(null);

	constructor(private facadeService: FacadeService) {}

	ngOnInit() {
		this.languageLabels = this.facadeService.getLanguageLabels();
	}
}

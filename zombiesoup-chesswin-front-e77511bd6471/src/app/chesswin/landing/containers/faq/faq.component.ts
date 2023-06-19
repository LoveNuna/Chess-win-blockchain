import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FacadeService } from 'facade-service';

@Component({
	selector: 'app-faq',
	templateUrl: './faq.component.html',
	styleUrls: ['./faq.component.scss']
})
export class FaqComponent implements OnInit {
	languageLabels: BehaviorSubject<any> = new BehaviorSubject<any>(null);

	constructor(private facadeService: FacadeService) {}

	ngOnInit() {
		this.languageLabels = this.facadeService.getLanguageLabels();
	}
}

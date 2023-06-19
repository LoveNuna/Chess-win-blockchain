import { Component, ChangeDetectionStrategy, Input, OnChanges, SimpleChanges } from '@angular/core';

@Component({
	selector: 'app-faq-view',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './faq-view.component.html',
	styleUrls: ['./faq-view.component.scss']
})
export class FaqViewComponent implements OnChanges {
	@Input() languageLabels: any;

	frequentlyAskedQuestions = [];

	ngOnChanges(changes: SimpleChanges) {
		if (changes && changes.languageLabels && changes.languageLabels.currentValue) {
			this.frequentlyAskedQuestions = [
				{
					question: this.languageLabels.faq.question1,
					answer: this.languageLabels.faq.answer1
				},
				{
					question: this.languageLabels.faq.question2,
					answer: this.languageLabels.faq.answer2
				},
				{
					question: this.languageLabels.faq.question3,
					answer: this.languageLabels.faq.answer3
				},
				{
					question: this.languageLabels.faq.question4,
					answer: this.languageLabels.faq.answer4
				},
				{
					question: this.languageLabels.faq.question5,
					answer: this.languageLabels.faq.answer5
				},
				{
					question: this.languageLabels.faq.question6,
					answer: this.languageLabels.faq.answer6
				},
				{
					question: this.languageLabels.faq.question7,
					answer: this.languageLabels.faq.answer7
				}
			];
		}
	}
}

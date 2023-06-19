import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
	selector: 'app-paginator',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './paginator.component.html',
	styleUrls: ['./paginator.component.scss']
})
export class PaginatorComponent implements OnInit {
	@Input() page: number;
	@Input() total: number;
	@Input() perPage: number;
	@Input() pagesToShow: number;

	maxPages: number;

	@Output() pageChangedEmitter: EventEmitter<number> = new EventEmitter<number>();

	ngOnInit() {
		this.maxPages = Math.ceil(this.total / this.perPage) || 0;
	}

	goToPreviousPage() {
		this.pageChanged(this.page - 1);
	}

	goNextPage() {
		this.pageChanged(this.page + 1);
	}

	pageChanged(pageNumber: number) {
		this.page = pageNumber;

		this.pageChangedEmitter.emit(pageNumber);
	}

	lastPage(): boolean {
		return this.perPage * this.page > this.total;
	}

	getPages(): number[] {
		const c = Math.ceil(this.total / this.perPage);
		const p = this.page || 1;
		const pagesToShow = this.pagesToShow || 9;
		const pages: number[] = [];

		pages.push(p);

		const times = pagesToShow - 1;

		for (let i = 0; i < times; i++) {
			if (pages.length < pagesToShow) {
				if (Math.min.apply(null, pages) > 1) {
					pages.push(Math.min.apply(null, pages) - 1);
				}
			}

			if (pages.length < pagesToShow) {
				if (Math.max.apply(null, pages) < c) {
					pages.push(Math.max.apply(null, pages) + 1);
				}
			}
		}

		pages.sort((a, b) => a - b);

		return pages;
	}
}

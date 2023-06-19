import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'orderByDate'
})
export class OrderByDatePipe implements PipeTransform {
	transform(value: any, argument: any): any {
		if (value) {
			value.sort((a: any, b: any) => {
				if (a[argument] > b[argument]) {
					return -1;
				} else if (a[argument] < b[argument]) {
					return 1;
				} else {
					return 0;
				}
			});
		}

		return value;
	}
}

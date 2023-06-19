import { Pipe, PipeTransform } from '@angular/core';

import * as numeral from 'numeral';

@Pipe({
	name: 'appHumanizeNumber'
})
export class NumberHumanizerPipe implements PipeTransform {
	transform(value: number): number {
		if (value < 1000) {
			return value;
		} else {
			return numeral(value).format('0.00a');
		}
	}
}

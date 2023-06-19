import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

// material
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class SnackbarService {
	constructor(private snackBar: MatSnackBar, private router: Router) {}

	openSnackbar(message: string, time: number, navigationPath: string) {
		this.snackBar
			.open(message, '', { duration: time })
			.afterDismissed()
			.subscribe(status => {
				if (status) {
					this.router.navigate([navigationPath]);
				}
			});
	}

	openSimpleSnackbar(message: string) {
		this.snackBar.open(message);
	}

	openSnackbarWithDismiss(message: string, time: number) {
		this.snackBar
			.open(message, 'Dismiss', { duration: time })
			.onAction()
			.subscribe(() => this.snackBar.dismiss());
	}

	openSnackbarWithAction(message: string, action: string, time: number) {
		return this.snackBar.open(message, action, { duration: time });
	}

	openSnackbarWithTimer(message: string, time: number) {
		this.snackBar.open(message, '', { duration: time });
	}

	closeSnackbar() {
		this.snackBar.dismiss();
	}
}

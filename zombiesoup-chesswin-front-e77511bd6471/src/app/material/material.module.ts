import { NgModule } from '@angular/core';

// modules
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
	imports: [
		MatDialogModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatMenuModule,
		MatProgressSpinnerModule,
		MatSelectModule,
		MatSidenavModule,
		MatSnackBarModule,
		MatTableModule,
		MatTooltipModule
	],
	exports: [
		MatDialogModule,
		MatFormFieldModule,
		MatIconModule,
		MatInputModule,
		MatMenuModule,
		MatProgressSpinnerModule,
		MatSelectModule,
		MatSidenavModule,
		MatSnackBarModule,
		MatTableModule,
		MatTooltipModule
	]
})
export class MaterialModule {}

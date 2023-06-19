import {
	Component,
	ChangeDetectionStrategy,
	Output,
	EventEmitter,
	ViewChild,
	ElementRef,
	OnInit,
	Input
} from '@angular/core';

// material
import { MatDialog } from '@angular/material/dialog';

// dialogs
import { PackagePaymentComponent } from '../../components/dialogs/package-payment/package-payment.component';
import { Router } from '@angular/router';
import { FacadeService } from 'facade-service';

declare const paypal;

const packages = [
	{
		id: 1,
		name: 'Black Pawn Packet of Coins',
		price: 5.0,
		coins: 5,
		fee_percent: 10,
		image: './assets/images/packages/packages-black-pawn-bg.png'
	},
	{
		id: 2,
		name: 'Pawn Packet of Coins',
		price: 10.0,
		coins: 10,
		fee_percent: 10,
		image: './assets/images/packages/packages-pawn-bg.png'
	},
	{
		id: 3,
		name: 'Rook Packet of Coins',
		price: 20.0,
		coins: 20,
		fee_percent: 10,
		image: './assets/images/packages/packages-rook-bg.png'
	},
	{
		id: 4,
		name: 'Horse Packet of Coins',
		price: 30.0,
		coins: 30,
		fee_percent: 10,
		image: './assets/images/packages/packages-knight-bg.png'
	},
	{
		id: 5,
		name: 'Offices Packet of Coins',
		price: 50.0,
		coins: 50,
		fee_percent: 10,
		image: './assets/images/packages/packages-bishop-bg.png'
	},
	{
		id: 6,
		name: 'Queen Packet of Coins',
		price: 100.0,
		coins: 100,
		fee_percent: 10,
		image: './assets/images/packages/packages-queen-bg.png'
	},
	{
		id: 7,
		name: 'King Packet of Coins',
		price: 300.0,
		coins: 300,
		fee_percent: 10,
		image: './assets/images/packages/packages-king-bg.png'
	},
];

@Component({
	selector: 'app-packages-view',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './packages-view.component.html',
	styleUrls: ['./packages-view.component.scss']
})
export class PackagesViewComponent implements OnInit {
	@Input() userId: string;

	@Output() paymentEmitter: EventEmitter<any> = new EventEmitter<any>();

	@ViewChild('paypalButton', { static: true }) paypalElement: ElementRef;
	@ViewChild('CCButton', { static: true }) CCElement: ElementRef;

	packages = packages;

	selectedPackage;

	paypalButtons;

	constructor(
		private dialog: MatDialog,
		private router: Router,
		private facadeService: FacadeService
	) {}

	ngOnInit() {
	}

	selectPackage(selectedPackage) {
		console.log("open the dialog")
		console.log(this.userId)
		if (!this.userId || this.userId.trim() === '') {
			
			this.dialog.open(PackagePaymentComponent, {
				width: '500px',
				panelClass: 'challenge-dialog'
			});

			return;
		}

		this.selectedPackage = selectedPackage;

		document
			.getElementById('paypalContainer')
			.scrollIntoView({ behavior: 'smooth' });

		this.renderButtons();
	}

	renderButtons() {
		if (this.paypalButtons && this.paypalButtons.close) {
			this.paypalButtons.close();
		}
		this.paypalButtons = paypal
			.Buttons({
				style: {
					size: 'responsive',
					color: 'gold',
					shape: 'rect'
				},
				createOrder: (data, actions) => {
					if (!this.selectedPackage) {
						return;
					}
					
					return actions.order.create({
						purchase_units: [
							{
								description: this.selectedPackage
									? this.selectedPackage.name
									: '',
								amount: {
									currency_code: 'USD',
									value: this.selectedPackage
										? (this.selectedPackage.price * (1 + this.selectedPackage.fee_percent / 100)).toFixed(2)
										: 0
								}
							}
						],
						application_context: {
							shipping_preference: 'NO_SHIPPING'
						}
					});
				},
				onApprove: async (data, actions) => {
					const order = await actions.order.capture();

					this.emitPaymentInfo(this.selectedPackage, false);
				},
				onError: error => {
					this.emitPaymentInfo(this.selectedPackage, true);
				}
			});

		this.paypalButtons.render(this.paypalElement.nativeElement);
	}

	emitPaymentInfo(shopPackage: any, error?: boolean) {
		this.paymentEmitter.emit({ shopPackage, error });
	}

	navigateToCreditCard() {
		if (this.selectedPackage) {
			this.router.navigate(['/app/credit-card'], {
				queryParams: {
					buyGold: this.selectedPackage.coins,
					price: this.selectedPackage.price * (1 + this.selectedPackage.fee_percent / 100),
					userId: this.userId
				}
			});
		} else {
			this.facadeService.openSnackbarWithTimer(
				'Please select a package!',
				3000
			);

			return;
		}
	}

	navigateToCash() {
		this.router.navigate(['/app/convert-to-cash']);
	}
}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// containers
import { AboutUsComponent } from '../containers/about-us/about-us.component';
import { FairPlayComponent } from '../containers/fair-play/fair-play.component';
import { FaqComponent } from '../containers/faq/faq.component';
import { HowToComponent } from '../containers/how-to/how-to.component';
import { LandingComponent } from '../containers/landing/landing.component';
import { PrivacyPolicyComponent } from '../containers/privacy-policy/privacy-policy.component';
import { HomeGuard } from 'src/app/guards/home.guard';
import { HomeViewComponent } from '../components/home-view/home-view.component';
import { ContactUsComponent } from '../containers/contact-us/contact-us.component';
import { PackagesComponent } from '../containers/packages/packages.component';
import { TermsAndConditionsComponent } from '../containers/terms-and-conditions/terms-and-conditions.component';
import { RefundPolicyComponent } from '../containers/refund-policy/refund-policy.component';

const landingRoutes: Routes = [
	{
		path: '',
		component: LandingComponent,
		children: [
			{
				path: '',
				component: HomeViewComponent,
				canActivate: [HomeGuard]
			},
			{
				path: 'faq',
				component: FaqComponent,
				canActivate: [HomeGuard]
			},
			{
				path: 'fair-play',
				component: FairPlayComponent,
				canActivate: [HomeGuard]
			},
			{
				path: 'privacy',
				component: PrivacyPolicyComponent,
				canActivate: [HomeGuard]
			},
			{
				path: 'how-to',
				component: HowToComponent,
				canActivate: [HomeGuard]
			},
			{
				path: 'contact-us',
				component: ContactUsComponent,
				canActivate: [HomeGuard]
			},
			{
				path: 'packages',
				redirectTo: '/app',
				pathMatch: 'full'
			},
			{
				path: 'terms-and-conditions',
				component: TermsAndConditionsComponent,
				canActivate: [HomeGuard]
			},
			{
				path: 'refund-policy',
				component: RefundPolicyComponent,
				canActivate: [HomeGuard]
			}
			// {
			//   path: 'about-us',
			//   component: AboutUsComponent
			// }
		]
	}
];

@NgModule({
	imports: [RouterModule.forChild(landingRoutes)],
	exports: [RouterModule]
})
export class LandingRouting {}

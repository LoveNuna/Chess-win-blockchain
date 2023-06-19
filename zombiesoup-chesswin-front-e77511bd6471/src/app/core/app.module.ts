import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

// modules
import { FacadeModule } from 'facade-module';
import { CommonModule } from 'common-module';
import { LandingModule } from '../chesswin/landing/landing.module';

// guards
import { AdminGuard } from '../guards/admin.guard';
import { AuthGuard } from '../guards/auth.guard';
import { GameGuard } from '../guards/game.guard';
import { HomeGuard } from '../guards/home.guard';

// routing
import { AppRouting } from './routing/app.routing';

// services
import { CookieService } from 'ngx-cookie-service';

// containers
import { AppComponent } from './containers/app/app.component';

// components
import { NotFoundComponent } from './components/not-found/not-found.component';
import { MobileBannerComponent } from './components/mobile-banner/mobile-banner.component';
import { StarComponent } from './components/mobile-banner/star/star.component';

@NgModule({
	declarations: [AppComponent, NotFoundComponent, MobileBannerComponent, StarComponent],
	imports: [BrowserModule, BrowserAnimationsModule, HttpClientModule, FacadeModule, CommonModule, LandingModule, AppRouting],
	providers: [AdminGuard, AuthGuard, GameGuard, HomeGuard, CookieService],
	bootstrap: [AppComponent]
})
export class AppModule {}

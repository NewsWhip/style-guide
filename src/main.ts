import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AppComponent } from './app/app.component';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { appRoutes } from './app/app.routing';
import { provideToasts } from 'nw-style-guide/toasts';
import { provideFeatureAlerts } from 'nw-style-guide/feature-alerts';

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        provideHttpClient(withInterceptorsFromDi()),
        provideRouter(appRoutes, withHashLocation()),
        provideToasts(),
        provideFeatureAlerts()
    ]
}).catch(err => console.log(err));

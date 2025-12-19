import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ToastsModule } from 'nw-style-guide/toasts';
import { FeatureAlertsModule } from 'nw-style-guide/feature-alerts';
import { AppComponent } from './app/app.component';
import { appRoutes } from './app/app.routing';
import { provideAnimations } from '@angular/platform-browser/animations';

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        provideRouter(appRoutes),
        provideAnimations(),
        provideHttpClient(withInterceptorsFromDi()),
        importProvidersFrom(
            ToastsModule.forRoot(),
            FeatureAlertsModule.forRoot()
        )
    ]
}).catch(err => console.log(err));

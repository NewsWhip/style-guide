import { enableProdMode, importProvidersFrom } from '@angular/core';
import { environment } from './environments/environment';
import { AppComponent } from './app/app.component';
import { DialogModule } from '@angular/cdk/dialog';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { PortalModule } from '@angular/cdk/portal';
import { ToastsModule } from './_lib/modules/toasts';
import { FeatureAlertsModule } from './_lib/modules/feature-alerts';
import { withInterceptorsFromDi, provideHttpClient } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { routing } from './app/app.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';

if (environment.production) {
    enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [
        importProvidersFrom(BrowserModule, FormsModule, ReactiveFormsModule, routing, FeatureAlertsModule, ToastsModule.forRoot(), FeatureAlertsModule.forRoot(), PortalModule, ScrollingModule, DialogModule),
        provideAnimations(),
        provideHttpClient(withInterceptorsFromDi())
    ]
}).catch(err => console.log(err));

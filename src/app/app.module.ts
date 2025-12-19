import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PortalModule } from '@angular/cdk/portal';
import { DialogModule } from '@angular/cdk/dialog';
import { NwPickerModule } from 'nw-style-guide/picker';
import { ToastsModule } from 'nw-style-guide/toasts';
import { FeatureAlertsModule } from 'nw-style-guide/feature-alerts';
import { TabsModule } from 'nw-style-guide/tabs';
import { ChartsModule } from 'nw-style-guide/charts';
import { LoaderModule } from 'nw-style-guide/loader';
import { CarouselModule } from 'nw-style-guide/carousel';
import { WordCloudModule } from 'nw-style-guide/word-cloud';
import { routing } from './app.routing';
import { EmailInputModule } from 'nw-style-guide/email-input';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AutoFocusModule } from 'nw-style-guide/autofocus';
import { TooltipModule } from 'nw-style-guide/tooltips';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CdkMenuModule } from '@angular/cdk/menu';

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        ReactiveFormsModule,
        routing,
        BrowserAnimationsModule,
        FeatureAlertsModule,
        NwPickerModule,
        ToastsModule.forRoot(),
        FeatureAlertsModule.forRoot(),
        PortalModule,
        TabsModule,
        ChartsModule,
        LoaderModule,
        CarouselModule,
        EmailInputModule,
        AutoFocusModule,
        TooltipModule,
        ScrollingModule,
        WordCloudModule,
        DialogModule,
        CdkMenuModule
    ],
    providers: [provideHttpClient(withInterceptorsFromDi())],
})
export class AppModule { }

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

import { AppComponent } from './app.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { routing } from './app.routing';
import { ColorsComponent } from './colors/colors.component';
import { HomeComponent } from './home/home.component';
import { TabsComponent } from './tabs/tabs.component';
import { BrandingComponent } from './branding/branding.component';
import { ListComponent } from './list/list.component';
import { FormsComponent } from './forms/forms.component';
import { ModalsComponent } from './modals/modals.component';
import { PaginationComponent } from './pagination/pagination.component';
import { LabelsComponent } from './labels/labels.component';
import { TablesComponent } from './tables/tables.component';
import { TooltipsComponent } from './tooltips/tooltips.component';
import { RelativeWeightComponent } from './relative-weight/relative-weight.component';
import { ToastsComponent } from './toasts/toasts.component';
import { DemoPillsComponent } from './pills/pills.component';
import { TypographyComponent } from './typography/typography.component';
import { PickerComponent } from './picker/picker.component';
import { FeatureAlertsComponent } from './feature-alerts/feature-alerts.component';
import { AnimationsComponent } from './animations/animations.component';
import { ChartsComponent } from './charts/charts.component';
import { LoaderComponent } from './loader/loader.component';
import { CarouselComponent } from './carousel/carousel.component';
import { EmailInputModule } from 'nw-style-guide/email-input';
import { EmailInputDemoComponent } from "./email-input/email-input-demo.component";
import { CopyCodeComponent } from './code/copy-code.component';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { AutofocusComponent } from './autofocus/autofocus.component';
import { AutoFocusModule } from 'nw-style-guide/autofocus';
import { TooltipModule } from 'nw-style-guide/tooltips';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AppCodeComponent } from './code/code.component';
import { FaqComponent } from './faq/faq-component';
import { WordCloudDemoComponent } from './word-cloud/word-cloud.component';
import { SpacingComponent } from './spacing/spacing.component';

@NgModule({
    declarations: [
        AppComponent,
        ButtonsComponent,
        ColorsComponent,
        HomeComponent,
        BrandingComponent,
        ListComponent,
        FormsComponent,
        ModalsComponent,
        PaginationComponent,
        LabelsComponent,
        TablesComponent,
        TooltipsComponent,
        RelativeWeightComponent,
        ToastsComponent,
        DemoPillsComponent,
        TypographyComponent,
        PickerComponent,
        TabsComponent,
        FeatureAlertsComponent,
        AnimationsComponent,
        ChartsComponent,
        LoaderComponent,
        CarouselComponent,
        EmailInputDemoComponent,
        CopyCodeComponent,
        AutofocusComponent,
        AppCodeComponent,
        FaqComponent,
        WordCloudDemoComponent,
        SpacingComponent
    ],
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
        DialogModule
    ],
    providers: [provideHttpClient(withInterceptorsFromDi())],
    bootstrap: [AppComponent]
})
export class AppModule { }

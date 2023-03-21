import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PortalModule } from '@angular/cdk/portal';
import { NwPickerModule } from '../_lib/modules/picker/picker.module';
import { ToastsModule } from '../_lib/modules/toasts';
import { FeatureAlertsModule } from '../_lib/modules/feature-alerts';
import { TabsModule } from '../_lib/modules/tabs';
import { ChartsModule } from "../_lib/modules/charts/charts.module";
import { LoaderModule } from '../_lib/modules/loader';
import { CarouselModule } from '../_lib/modules/carousel/carousel.module';
import { WordCloudModule } from '../_lib/modules/word-cloud';

import { AppComponent } from './app.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { routing } from './app.routing';
import { ColorsComponent } from './colors/colors.component';
import { HomeComponent } from './home/home.component';
import { DropdownsComponent } from './dropdowns/dropdowns.component';
import { TabsComponent } from './tabs/tabs.component';
import { BrandingComponent } from './branding/branding.component';
import { ListComponent } from './list/list.component';
import { FormsComponent } from './forms/forms.component';
import { ModalsComponent } from './modals/modals.component';
import { AlertsComponent } from './alerts/alerts.component';
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
import { DropdownsModule } from "../_lib/modules/dropdowns/dropdowns.module";
import { EmailInputModule } from "../_lib/modules/email-input/email-input.module";
import { EmailInputDemoComponent } from "./email-input/email-input-demo.component";
import { CopyCodeComponent } from './code/copy-code.component';
import { HttpClientModule } from '@angular/common/http';
import { AutofocusComponent } from './autofocus/autofocus.component';
import { AutoFocusModule } from '../_lib/modules/autofocus';
import { TooltipModule } from '../_lib/modules/tooltips';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { AppCodeComponent } from './code/code.component';
import { FaqComponent } from './faq/faq-component';

@NgModule({
  declarations: [
    AppComponent,
    ButtonsComponent,
    ColorsComponent,
    HomeComponent,
    DropdownsComponent,
    BrandingComponent,
    ListComponent,
    FormsComponent,
    ModalsComponent,
    AlertsComponent,
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
    FaqComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    routing,
    BrowserAnimationsModule,
    HttpClientModule,
    FeatureAlertsModule,
    NwPickerModule,
    ToastsModule.forRoot(),
    FeatureAlertsModule.forRoot(),
    PortalModule,
    TabsModule,
    ChartsModule,
    LoaderModule,
    CarouselModule,
    DropdownsModule,
    EmailInputModule,
    AutoFocusModule,
    TooltipModule,
    ScrollingModule,
    WordCloudModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

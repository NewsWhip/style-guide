import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PopoverModule } from 'ngx-bootstrap/popover'
import { PortalModule } from '@angular/cdk/portal';
import { MarkdownModule } from 'ngx-md';
import { NwPickerModule } from '../_lib/modules/picker/picker.module';
import { ToastsModule } from '../_lib/modules/toasts';
import { FeatureAlertsModule } from '../_lib/modules/feature-alerts';
import { TabsModule } from '../_lib/modules/tabs';
import { ChartsModule } from "../_lib/modules/charts/charts.module";


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
    ChartsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    routing,
    BrowserAnimationsModule,
    PopoverModule.forRoot(),
    FeatureAlertsModule,
    NwPickerModule,
    ToastsModule.forRoot(),
    MarkdownModule.forRoot(),
    FeatureAlertsModule.forRoot(),
    PortalModule,
    TabsModule,
    ChartsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

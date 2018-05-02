import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PortalModule } from '@angular/cdk/portal';
import { MarkdownModule } from 'ngx-md';
import { NwPickerModule } from '../_lib/modules/picker/picker.module';
import { ToastsModule } from '../_lib/modules/toasts';
import { FeatureAlertsModule } from '../_lib/modules/feature-alerts';
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
import { FilterComponent } from './filter/filter.component';
import { TypographyComponent } from './typography/typography.component';
import { PickerComponent } from './picker/picker.component';
import { TabsModule } from '../_lib/modules/tabs';
import { FeatureAlertsComponent } from './feature-alerts/feature-alerts.component';

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
    FilterComponent,
    TypographyComponent,
    PickerComponent,
    TabsComponent,
    FeatureAlertsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    BrowserAnimationsModule,
    FeatureAlertsModule,
    NwPickerModule,
    ToastsModule.forRoot(),
    MarkdownModule.forRoot(),
    PortalModule,
    TabsModule
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

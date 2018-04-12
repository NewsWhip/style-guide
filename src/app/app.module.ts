import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

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

@NgModule({
  declarations: [
    AppComponent,
    ButtonsComponent,
    ColorsComponent,
    HomeComponent,
    DropdownsComponent,
    TabsComponent,
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
    TypographyComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    routing,
    BrowserAnimationsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { routing } from './app.routing';
import { ColorsComponent } from './colors/colors.component';
import { InteractiveTextComponent } from './interactive-text/interactive-text.component';
import { HomeComponent } from './home/home.component';
import { DropdownsComponent } from './dropdowns/dropdowns.component';
import { TabsComponent } from './tabs/tabs.component';
import { BrandingComponent } from './branding/branding.component';
import { ListComponent } from './list/list.component';
import { FormsComponent } from './forms/forms.component';

@NgModule({
  declarations: [
    AppComponent,
    ButtonsComponent,
    ColorsComponent,
    InteractiveTextComponent,
    HomeComponent,
    DropdownsComponent,
    TabsComponent,
    BrandingComponent,
    ListComponent,
    FormsComponent
  ],
  imports: [
    BrowserModule,
    routing,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

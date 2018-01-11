import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


import { AppComponent } from './app.component';
import { ButtonsComponent } from './buttons/buttons.component';
import { routing } from './app.routing';
import { ColorsComponent } from './colors/colors.component';
import { InteractiveTextComponent } from './interactive-text/interactive-text.component';
import { HomeComponent } from './home/home.component';
import { DropdownsComponent } from './dropdowns/dropdowns.component';

@NgModule({
  declarations: [
    AppComponent,
    ButtonsComponent,
    ColorsComponent,
    InteractiveTextComponent,
    HomeComponent,
    DropdownsComponent
  ],
  imports: [
    BrowserModule,
    routing,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

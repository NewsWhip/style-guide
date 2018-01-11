import { ModuleWithProviders, Injectable } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ButtonsComponent } from './buttons/buttons.component';
import { ColorsComponent } from './colors/colors.component';
import { InteractiveTextComponent } from './interactive-text/interactive-text.component';
import { HomeComponent } from './home/home.component';
import { DropdownsComponent } from './dropdowns/dropdowns.component';

const appRoutes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'buttons',
        component: ButtonsComponent
    },
    {
        path: 'colors',
        component: ColorsComponent
    },
    {
        path: 'interactive-text',
        component: InteractiveTextComponent
    },
    {
        path: 'dropdowns',
        component: DropdownsComponent
    }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes, { useHash: true });

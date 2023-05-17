import { ModuleWithProviders, Injectable } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ButtonsComponent } from './buttons/buttons.component';
import { ColorsComponent } from './colors/colors.component';
import { HomeComponent } from './home/home.component';
import { DropdownsComponent } from './dropdowns/dropdowns.component';
import { TabsComponent } from './tabs/tabs.component';
import { BrandingComponent } from './branding/branding.component';
import { ListComponent } from './list/list.component';
import { FormsComponent } from './forms/forms.component';
import { ModalsComponent } from "./modals/modals.component";
import { AlertsComponent } from "./alerts/alerts.component";
import { PaginationComponent } from "./pagination/pagination.component";
import { LabelsComponent } from "./labels/labels.component";
import { TablesComponent } from './tables/tables.component';
import { TooltipsComponent } from './tooltips/tooltips.component';
import { RelativeWeightComponent } from "./relative-weight/relative-weight.component";
import { ToastsComponent } from "./toasts/toasts.component";
import { DemoPillsComponent } from "./pills/pills.component";
import { TypographyComponent } from "./typography/typography.component";
import { PickerComponent } from "./picker/picker.component";
import { FeatureAlertsComponent } from "./feature-alerts/feature-alerts.component";
import { AnimationsComponent } from "./animations/animations.component";
import { ChartsComponent } from "./charts/charts.component";
import { LoaderComponent } from './loader/loader.component';
import { CarouselComponent } from './carousel/carousel.component';
import { EmailInputDemoComponent } from "./email-input/email-input-demo.component";
import { AutofocusComponent } from './autofocus/autofocus.component';
import { WordCloudDemoComponent } from './word-cloud/word-cloud.component';
import { SpacingComponent } from './spacing/spacing.component';

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
        path: 'dropdowns',
        component: DropdownsComponent
    },
    {
        path: 'tabs',
        component: TabsComponent
    },
    {
        path: 'branding',
        component: BrandingComponent
    },
    {
        path: 'lists',
        component: ListComponent
    },
    {
        path: 'forms',
        component: FormsComponent
    },
    {
        path: 'modals',
        component: ModalsComponent
    },
    {
        path: 'alerts',
        component: AlertsComponent
    },
    {
        path: 'pagination',
        component: PaginationComponent
    },
    {
        path: 'labels',
        component: LabelsComponent
    },
    {
        path: 'tables',
        component: TablesComponent
    },
    {
        path: 'tooltips',
        component: TooltipsComponent
    },
    {
        path: 'relative-weighting',
        component: RelativeWeightComponent
    },
    {
        path: 'pills',
        component: DemoPillsComponent
    },
    {
        path: 'typography',
        component: TypographyComponent
    },
    {
        path: 'picker',
        component: PickerComponent
    },
    {
        path: 'toasts',
        component: ToastsComponent
    },
    {
        path: 'feature-alerts',
        component: FeatureAlertsComponent
    },
    {
        path: 'animations',
        component: AnimationsComponent
    },
    {
        path: 'charts',
        component: ChartsComponent
    },
    {
        path: 'loader',
        component: LoaderComponent
    },
    {
        path: 'carousel',
        component: CarouselComponent
    },
    {
        path: 'email-input',
        component: EmailInputDemoComponent
    },
    {
        path: 'autofocus',
        component: AutofocusComponent
    },
    {
        path: 'word-cloud',
        component: WordCloudDemoComponent
    },
    {
        path: 'spacing',
        component: SpacingComponent
    }
];

export const routing: ModuleWithProviders<RouterModule> = RouterModule.forRoot(appRoutes, { useHash: true });

import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () => import('./home/home.component').then(mod => mod.HomeComponent)
    },
    {
        path: 'buttons',
        loadComponent: () => import('./buttons/buttons.component').then(mod => mod.ButtonsComponent)
    },
    {
        path: 'colors',
        loadComponent: () => import('./colors/colors.component').then(mod => mod.ColorsComponent)
    },
    {
        path: 'dropdowns',
        loadComponent: () => import('./dropdowns/dropdowns.component').then(mod => mod.DropdownsComponent)
    },
    {
        path: 'tabs',
        loadComponent: () => import('./tabs/tabs.component').then(mod => mod.TabsComponent)
    },
    {
        path: 'branding',
        loadComponent: () => import('./branding/branding.component').then(mod => mod.BrandingComponent)
    },
    {
        path: 'lists',
        loadComponent: () => import('./list/list.component').then(mod => mod.ListComponent)
    },
    {
        path: 'forms',
        loadComponent: () => import('./forms/forms.component').then(mod => mod.FormsComponent)
    },
    {
        path: 'modals',
        loadComponent: () => import('./modals/modals.component').then(mod => mod.ModalsComponent)
    },
    {
        path: 'alerts',
        loadComponent: () => import('./alerts/alerts.component').then(mod => mod.AlertsComponent)
    },
    {
        path: 'pagination',
        loadComponent: () => import('./pagination/pagination.component').then(mod => mod.PaginationComponent)
    },
    {
        path: 'labels',
        loadComponent: () => import('./labels/labels.component').then(mod => mod.LabelsComponent)
    },
    {
        path: 'tables',
        loadComponent: () => import('./tables/tables.component').then(mod => mod.TablesComponent)
    },
    {
        path: 'tooltips',
        loadComponent: () => import('./tooltips/tooltips.component').then(mod => mod.TooltipsComponent)
    },
    {
        path: 'relative-weighting',
        loadComponent: () => import('./relative-weight/relative-weight.component').then(mod => mod.RelativeWeightComponent)
    },
    {
        path: 'pills',
        loadComponent: () => import('./pills/pills.component').then(mod => mod.DemoPillsComponent)
    },
    {
        path: 'typography',
        loadComponent: () => import('./typography/typography.component').then(mod => mod.TypographyComponent)
    },
    {
        path: 'picker',
        loadComponent: () => import('./picker/picker.component').then(mod => mod.PickerComponent)
    },
    {
        path: 'toasts',
        loadComponent: () => import('./toasts/toasts.component').then(mod => mod.ToastsComponent)
    },
    {
        path: 'feature-alerts',
        loadComponent: () => import('./feature-alerts/feature-alerts.component').then(mod => mod.FeatureAlertsComponent)
    },
    {
        path: 'animations',
        loadComponent: () => import('./animations/animations.component').then(mod => mod.AnimationsComponent)
    },
    {
        path: 'charts',
        loadComponent: () => import('./charts/charts.component').then(mod => mod.ChartsComponent)
    },
    {
        path: 'loader',
        loadComponent: () => import('./loader/loader.component').then(mod => mod.LoaderComponent)
    },
    {
        path: 'carousel',
        loadComponent: () => import('./carousel/carousel.component').then(mod => mod.CarouselComponent)
    },
    {
        path: 'email-input',
        loadComponent: () => import('./email-input/email-input-demo.component').then(mod => mod.EmailInputDemoComponent)
    },
    {
        path: 'autofocus',
        loadComponent: () => import('./autofocus/autofocus.component').then(mod => mod.AutofocusComponent)
    },
    {
        path: 'word-cloud',
        loadComponent: () => import('./word-cloud/word-cloud.component').then(mod => mod.WordCloudDemoComponent)
    },
    {
        path: 'spacing',
        loadComponent: () => import('./spacing/spacing.component').then(mod => mod.SpacingComponent)
    }
];

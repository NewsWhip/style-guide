import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart.component';
import { PathDirective } from './path/path.directive';
import { XAxisDirective } from './axis/x-axis.directive';
import { YAxisDirective } from './axis/y-axis.directive';
import { CircleDirective } from './circle/circle.directive';
import { BrushDirective } from './brush/brush.directive';
import { BarDirective } from './bar/bar.directive';
import { AreaDirective } from './area/area.directive';
import { ChartTooltipDirective } from './tooltip/chart-tooltip.directive';
import { ResizeObserverModule } from '../resize-observer';

@NgModule({
    imports: [
        CommonModule,
        ResizeObserverModule
    ],
    declarations: [
        ChartComponent,
        PathDirective,
        XAxisDirective,
        YAxisDirective,
        CircleDirective,
        BrushDirective,
        BarDirective,
        AreaDirective,
        ChartTooltipDirective
    ],
    exports: [
        ChartComponent,
        PathDirective,
        XAxisDirective,
        YAxisDirective,
        CircleDirective,
        BrushDirective,
        BarDirective,
        AreaDirective,
        ChartTooltipDirective
    ]
})
export class ChartsModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartComponent } from './chart.component';
import { PathDirective } from './path/path.directive';
import { XAxisDirective } from './axis/x-axis.directive';
import { YAxisDirective } from './axis/y-axis.directive';
import { CircleDirective } from './circle/circle.directive';
import { BrushDirective } from './brush/brush.directive';

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        ChartComponent,
        PathDirective,
        XAxisDirective,
        YAxisDirective,
        CircleDirective,
        BrushDirective
    ],
    exports: [
        ChartComponent,
        PathDirective,
        XAxisDirective,
        YAxisDirective,
        CircleDirective,
        BrushDirective
    ]
})
export class ChartsModule { }

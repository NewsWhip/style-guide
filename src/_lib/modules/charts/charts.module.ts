import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CircleDirective } from './circle/circle.directive';
import { ChartDirective } from './chart.directive';
import { PathDirective } from "./path/path.directive";
import { XAxisComponent } from "./axis/x-axis.component";
import { YAxisComponent } from "./axis/y-axis.component";

@NgModule({
    imports: [
        CommonModule
    ],
    declarations: [
        CircleDirective,
        ChartDirective,
        PathDirective,
        XAxisComponent,
        YAxisComponent
    ],
    exports: [
        CircleDirective,
        ChartDirective,
        PathDirective,
        XAxisComponent,
        YAxisComponent
    ]
})
export class ChartsModule { }

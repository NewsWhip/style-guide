export { ChartComponent } from './chart.component';
export { PathDirective } from './path/path.directive';
export { XAxisDirective } from './axis/x-axis.directive';
export { YAxisDirective } from './axis/y-axis.directive';
export { CircleDirective } from './circle/circle.directive';
export { BrushDirective } from './brush/brush.directive';
export { BarDirective } from './bar/bar.directive';
export { AreaDirective } from './area/area.directive';
export { ChartTooltipDirective } from './tooltip/chart-tooltip.directive';
export { ForeignObjectDirective } from './foreign-object/foreign-object.directive';
export { TextDirective } from './text/text.directive';

import { ChartComponent } from './chart.component';
import { PathDirective } from './path/path.directive';
import { XAxisDirective } from './axis/x-axis.directive';
import { YAxisDirective } from './axis/y-axis.directive';
import { CircleDirective } from './circle/circle.directive';
import { BrushDirective } from './brush/brush.directive';
import { BarDirective } from './bar/bar.directive';
import { AreaDirective } from './area/area.directive';
import { ChartTooltipDirective } from './tooltip/chart-tooltip.directive';
import { ForeignObjectDirective } from './foreign-object/foreign-object.directive';
import { TextDirective } from './text/text.directive';

/**
 * Export cooperating directives
 * https://v17.angular.io/guide/standalone-components#standalone-components-for-library-authors
 */
export const CHARTS_DIRECTIVES = [
    ChartComponent,
    PathDirective,
    XAxisDirective,
    YAxisDirective,
    CircleDirective,
    BrushDirective,
    BarDirective,
    AreaDirective,
    ChartTooltipDirective,
    ForeignObjectDirective,
    TextDirective
] as const;

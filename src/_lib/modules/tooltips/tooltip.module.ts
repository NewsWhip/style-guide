import { OverlayModule } from "@angular/cdk/overlay";
import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { TooltipContainerComponent } from "./tooltip-container.component";
import { TooltipDirective } from "./tooltip.directive";
import { WindowRef } from "../feature-alerts/windowref";

@NgModule({
    imports: [
        CommonModule,
        OverlayModule
    ],
    providers: [WindowRef],
    declarations: [
        TooltipDirective,
        TooltipContainerComponent
    ],
    exports: [
        TooltipDirective,
        TooltipContainerComponent
    ]
})
export class TooltipModule {}
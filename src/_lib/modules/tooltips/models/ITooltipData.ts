import { TemplateRef } from "@angular/core";

export interface ITooltipData {
    tooltip: string | TemplateRef<any>;
    containerClass?: string;
    withArrow: boolean;
    withClose: boolean;
    templateRefContext?: any;
}
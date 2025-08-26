import { InjectionToken } from "@angular/core";
import { ITooltipData } from "../models/ITooltipData";

export const TOOLTIP_CONTEXT_TOKEN = new InjectionToken<ITooltipData>('tooltip-context');
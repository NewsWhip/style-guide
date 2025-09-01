import { ScaleLinear, ScaleTime } from "d3-scale";

export type NwXAxisScale = ScaleLinear<number, number> | ScaleTime<number, number>;

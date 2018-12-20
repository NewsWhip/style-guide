import { Injectable, SimpleChange } from "@angular/core";
import { ScaleTime, ScaleLinear } from 'd3-scale';
import { Observable } from "rxjs/Observable";
import { Subject } from "rxjs/Subject";

@Injectable()
export class ChartService {

    public width: number;
    public height: number;

    // TODO: needs to be configurable
    // TODO: possibly remove all these
    public xScale: ScaleTime<number, number>;
    public yScale: ScaleLinear<number, number>;
    public xRange: [number, number];
    public yRange: [number, number];

    private _scales$: Subject<IScaleEvent> = new Subject();

    public scales$: Observable<IScaleEvent>;

    constructor() {
        console.log('ChartService')
        this.scales$ = this._scales$.asObservable();
    }

    setDomains() {
        this.xScale.domain(this.xRange);
        this.yScale.domain(this.yRange);
    }

    updateDomains() {
        this.setDomains()
        this._scales$.next({
            x: this.xScale,
            y: this.yScale
        })
    }

    static areDatasetsEqual(a: Array<[number, number]>, b: Array<[number, number]>) {
        return a.length === b.length &&
            a.every((value, index) => {
                return value[0] === b[index][0] && value[1] === b[index][1]
            });
    }

    static _hasRangeChanged(xRange: SimpleChange, yRange: SimpleChange): boolean {
        let isXRangeChange = xRange &&
            !xRange.firstChange;

        let isYRangeChange = yRange &&
            !yRange.firstChange;

        return isXRangeChange || isYRangeChange;
    }

}

export interface IScaleEvent {
    x: ScaleTime<number, number>;
    y: ScaleLinear<number, number>;
}

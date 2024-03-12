import { Injectable, SimpleChange } from "@angular/core";
import { easeCubicInOut } from "d3-ease";
import { Subject, Observable } from "rxjs";

@Injectable()
export class ChartUtils {

    public static ANIMATION_DURATION: number = 1000;
    public static ANIMATION_EASING: (normalizedTime: number) => number = easeCubicInOut;

    private _chartResize$: Subject<void>;
    public chartResize$: Observable<any>;

    constructor() {
        this._chartResize$ = new Subject();
        this.chartResize$ = this._chartResize$.asObservable();
    }

    static areDatasetsEqual(a: Array<[number, number]>, b: Array<[number, number]>) {
        return a.length === b.length &&
            a.every((value, index) => {
                return value[0] === b[index][0] && value[1] === b[index][1];
            });
    }

    static haveDomainsChanged(xDomain: SimpleChange, yDomain: SimpleChange): boolean {
        return this.hasInputChanged(xDomain) || this.hasInputChanged(yDomain);
    }

    static hasInputChanged(input: SimpleChange): boolean {
        return input &&
            !input.firstChange &&
            input.previousValue !== input.currentValue;
    }

    notifyChartResize(): void {
        this._chartResize$.next();
    }

}

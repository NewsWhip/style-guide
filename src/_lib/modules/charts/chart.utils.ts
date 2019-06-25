import { Injectable, SimpleChange } from "@angular/core";
import { easeCubicInOut } from "d3-ease";
import { debounceTime, share } from "rxjs/operators";
import { Subject, Observable, fromEvent } from "rxjs";

@Injectable()
export class ChartUtils {

    public static ANIMATION_DURATION: number = 1000;
    public static ANIMATION_EASING: (normalizedTime: number) => number = easeCubicInOut;

    private _windowResize$: Subject<number>;
    public windowResize$: Observable<any>;

    constructor() {
        this._windowResize$ = new Subject();
        this.windowResize$ = this._windowResize$.asObservable();

        this._subscribeToWindowResize();
    }

    private _subscribeToWindowResize() {
        fromEvent(window, 'resize')
            .pipe(
                debounceTime(100),
                share()
            )
            .subscribe(_ => {
                this._windowResize$.next(window.innerWidth);
            })
    }

    static areDatasetsEqual(a: Array<[number, number]>, b: Array<[number, number]>) {
        return a.length === b.length &&
            a.every((value, index) => {
                return value[0] === b[index][0] && value[1] === b[index][1]
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

}

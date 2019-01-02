import { Injectable, SimpleChange } from "@angular/core";

@Injectable()
export class ChartService {

    public width: number;
    public height: number;

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
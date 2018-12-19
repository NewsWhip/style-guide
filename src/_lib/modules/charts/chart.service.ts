import { Injectable } from '@angular/core';

@Injectable()
export class ChartService {

    public data: Array<[number, number]> = [];
    public width: number;
    public height: number;

    public xRange: [number, number];
    public yRange: [number, number];

    /**
     * Convert x datapoint to pixel position
     */
    toX(value: number): number {
        return ((value - this.xRange[0]) / (this.xRange[1] - this.xRange[0]) * this.width);
    }

    /**
     * Convert y datapoint to pixel position
     */
    toY(value: number): number {
        return this.height - ((value - this.yRange[0]) / (this.yRange[1] - this.yRange[0]) * this.height);
    }

    /**
     * Convert x pixel position to x datapoint
     */
    fromX(x: number) {
        return (x / this.width) * (this.xRange[1] - this.xRange[0]) + this.xRange[0];
    }

    /**
     * Convert y pixel position to y datapoint
     */
    fromY(y: number) {
        return (y / this.height) * (this.yRange[1] - this.yRange[0]) + this.yRange[0];
    }

    setRange(xRange: [number, number], yRange: [number, number]) {
        this.xRange = xRange;
        this.yRange = yRange;
    }

}

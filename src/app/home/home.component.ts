import { DecimalPipe } from '@angular/common';
import { Component, OnInit, VERSION } from '@angular/core';
import { scaleLinear } from 'd3-scale';
import { entities1, entities2 } from './test-data';

interface IQuadrant {
    area: Array<[number, number, number]>;
    id: string;
    labels: {
        className?: string;
        value: string;
        textAnchor: 'start' | 'middle' | 'end';
        point: [number, number]
    }[];
    zoomedDetails: {
        x: {
            domain: [number, number];
            axisAlign: 'left' | 'right';
        }
        y: {
            domain: [number, number];
            axisAlign: 'top' | 'bottom';
        }
    }
}

export interface IEntity {
    x: number;
    y: number;
    name: string;
    id: any;
}

export interface IGroupedEntity {
    x: number;
    y: number;
    positionDetails: Square;
    entities: IEntity[];
    translate: string;
}

export type Square = {
    position: [number, number];
    x: number;
    y: number;
    textAnchor: 'start' | 'end' | 'middle';
    dy: number;
    dx: number;
    width: number;
    height: number;
}

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    providers: [DecimalPipe]
})
export class HomeComponent implements OnInit {

    public version = VERSION;

    public xDomain: [number, number];
    public yDomain: [number, number];
    public chartMargins = { top: 50, bottom: 50, left: 60, right: 60 };
    public axisTickFormat = (d: number) => this._decimalPipe.transform(d, '1.0-0');
    public axisScale = scaleLinear();
    public entities1 = entities1;
    public entities2 = entities2;
    public entities3: IEntity[];
    public quadrants: IQuadrant[];
    public activeQuadrant: IQuadrant | null; 
    public axisLabels;
    public get entities(): IEntity[] {
        return this.entities3;
    }
    public groupedEntities: IGroupedEntity[];
    public activeGroup: IGroupedEntity;
    public squares: Square[];
    public maxEntitiesToDisplay = 3;
    public center;

    constructor(private _decimalPipe: DecimalPipe) { }

    getEntities3() {
        const articleCountRange = [2, 400];
        const interactionRange = [234, 12587];

        const randomInRange = (min: number, max: number) => {
            min = Math.ceil(min);
            max = Math.floor(max);
            return Math.floor(Math.random() * (max - min + 1) + min);
        }

        return entities2.slice(0, 20).map(e => {
            return {
                ...e,
                x: randomInRange(articleCountRange[0], articleCountRange[1]),
                y: randomInRange(interactionRange[0], interactionRange[1])
            }
        });
    }

    ngOnInit(): void {
        this.entities3 = this.getEntities3();

        this.setDomains();
        this.center = {
            x: ((this.xDomain[1] - this.xDomain[0]) / 2) + this.xDomain[0],
            y: ((this.yDomain[1] - this.yDomain[0]) / 2) + this.yDomain[0]
        };
        this.quadrants = this.getQuadrants();
        this.axisLabels = this.getAxisLabels();
        this.squares = this.divideChart();
        this.groupedEntities = this.getGroupedEntities();
        console.log(this.groupedEntities);
    }

    setDomains() {
        const interactionCounts = this.entities.map(e => e.y);
        const articleCounts = this.entities.map(e => e.x);

        this.xDomain = [Math.min(...articleCounts), Math.max(...articleCounts)];
        this.yDomain = [Math.min(...interactionCounts), Math.max(...interactionCounts)];
    }

    onQuadrantMouseenter(quadrant: IQuadrant): void {
        this.activeQuadrant = quadrant;
    }

    onChartMouseleave(): void {
        this.activeQuadrant = null;
    }

    zoomInQuadrant(quadrant: IQuadrant): void {
        this.xDomain = quadrant.zoomedDetails.x.domain;
        this.yDomain = quadrant.zoomedDetails.y.domain;
    }

    zoomOut() {
        this.setDomains();
    }

    getQuadrants(): IQuadrant[] {
        const center = {
            x: ((this.xDomain[1] - this.xDomain[0]) / 2) + this.xDomain[0],
            y: ((this.yDomain[1] - this.yDomain[0]) / 2) + this.yDomain[0]
        };

        /**
         * All quadrants are extended well beyond the bounds of the chart, with the out-of-bounds portions cutoff by the
         * overflow: hidden on the chart svg
         */
        const left = this.xDomain[0] - this.xDomain[1];
        const top = this.yDomain[1] * 2;
        const right = this.xDomain[1] * 2;
        const bottom = this.yDomain[0] - this.yDomain[1];
        const xZoomOverlap = (this.xDomain[1] - this.xDomain[0]) * 0.05;
        const yZoomOverlap = (this.yDomain[1] - this.yDomain[0]) * 0.05;

        const topLeft: IQuadrant = {
            area: [
                [left, top, center.y] as [number, number, number],
                [center.x, top, center.y] as [number, number, number]
            ],
            id: 'top-left',
            labels: [
                {
                    className: 'bolded',
                    value: 'Higher Public Interest',
                    textAnchor: 'start',
                    point: [this.xDomain[0], this.yDomain[1]]
                },
                {
                    value: 'Lower Media Interest',
                    textAnchor: 'start',
                    point: [this.xDomain[0], this.yDomain[1]]
                }
            ],
            zoomedDetails: {
                x: {
                    domain: [this.xDomain[0], center.x + xZoomOverlap],
                    axisAlign: 'right'
                },
                y: {
                    domain: [center.y - yZoomOverlap, this.yDomain[1]],
                    axisAlign: 'bottom'
                }
            }
        };
        
        const topRight: IQuadrant = {
            area: [
                [center.x, top, center.y] as [number, number, number],
                [right, top, center.y] as [number, number, number]
            ],
            id: 'top-right',
            labels: [
                {
                    className: 'bolded',
                    value: 'Higher Public Interest',
                    textAnchor: 'end',
                    point: [this.xDomain[1], this.yDomain[1]]
                },
                {
                    className: 'bolded',
                    value: 'Higher Media Interest',
                    textAnchor: 'end',
                    point: [this.xDomain[1], this.yDomain[1]]
                }
            ],
            zoomedDetails: {
                x: {
                    domain: [center.x - xZoomOverlap, this.xDomain[1]],
                    axisAlign: 'left'
                },
                y: {
                    domain: [center.y - yZoomOverlap, this.yDomain[1]],
                    axisAlign: 'bottom'
                }
            }
        };

        const bottomRight: IQuadrant = {
            area: [
                [center.x, center.y, bottom] as [number, number, number],
                [right, center.y, bottom] as [number, number, number]
            ],
            id: 'bottom-right',
            labels: [
                {
                    value: 'Lower Public Interest',
                    textAnchor: 'end',
                    point: [this.xDomain[1], this.yDomain[0]]
                },
                {
                    className: 'bolded',
                    value: 'Higher Media Interest',
                    textAnchor: 'end',
                    point: [this.xDomain[1], this.yDomain[0]]
                }
            ],
            zoomedDetails: {
                x: {
                    domain: [center.x - xZoomOverlap, this.xDomain[1]],
                    axisAlign: 'left'
                },
                y: {
                    domain: [this.yDomain[0], center.y + yZoomOverlap],
                    axisAlign: 'top'
                }
            }
        };

        const bottomLeft: IQuadrant = {
            area: [
                [left, center.y, bottom] as [number, number, number],
                [center.x, center.y, bottom] as [number, number, number]
            ],
            id: 'bottom-left',
            labels: [
                {
                    value: 'Lower Public Interest',
                    textAnchor: 'start',
                    point: [this.xDomain[0], this.yDomain[0]]
                },
                {
                    value: 'Lower Media Interest',
                    textAnchor: 'start',
                    point: [this.xDomain[0], this.yDomain[0]]
                }
            ],
            zoomedDetails: {
                x: {
                    domain: [this.xDomain[0], center.x + xZoomOverlap],
                    axisAlign: 'right'
                },
                y: {
                    domain: [this.yDomain[0], center.y + yZoomOverlap],
                    axisAlign: 'top'
                }
            }
        };

        return [
            topLeft,
            topRight,
            bottomRight,
            bottomLeft
        ];
    }

    getAxisLabels() {
        const center = {
            x: ((this.xDomain[1] - this.xDomain[0]) / 2) + this.xDomain[0],
            y: ((this.yDomain[1] - this.yDomain[0]) / 2) + this.yDomain[0]
        };

        const minX = {
            point: [this.xDomain[0], center.y],
            label: 'Articles',
            value: this.xDomain[0],
            textAnchor: 'end',
            translate: '-8px 0'
        }

        const maxX = {
            point: [this.xDomain[1], center.y],
            label: 'Articles',
            value: this.xDomain[1],
            textAnchor: 'start',
            translate: '8px 0'
        }

        const minY = {
            point: [center.x, this.yDomain[0]],
            label: 'Interactions',
            value: this.yDomain[0],
            textAnchor: 'middle',
            translate: '0 20px'
        }

        const maxY = {
            point: [center.x, this.yDomain[1]],
            label: 'Interactions',
            value: this.yDomain[1],
            textAnchor: 'middle',
            translate: '0 -26px'
        }

        return [
            minX,
            maxX,
            minY,
            maxY
        ];
    }

    getGroupedEntities(): IGroupedEntity[] {
        type MapKey = `${number}:${number}`;
        const map = new Map<MapKey, IEntity[]>();

        this.entities.forEach(e => {
            const key: MapKey = `${e.x}:${e.y}`;

            if (map.has(key)) {
                const currentValue = map.get(key);
                map.set(key, currentValue.concat(e));
            } else {
                map.set(key, [e])
            }
        });


        return [...map.keys()].map(key => {
            const [x, y] = key.split(':').map(val => +val);
            const entities = map.get(key);
            const square = this.squares.find(sq => {
                const x1 = sq.x - sq.width;
                const y1 = sq.y + sq.height;

                return (x >= x1 && x <= sq.x) && (y <= y1 && y >= sq.y);
            });

            const translate = (square.dy && square.textAnchor !== 'middle') ?
                `0 ${-square.dy}px`:
                '0 0';

            return {
                x,
                y,
                positionDetails: square,
                entities,
                translate
            }
        })
    }

    divideChart(numDivisions: number = 16): Square[] {
        const divisor = numDivisions / 4;
        const colWidth = (this.xDomain[1] - this.xDomain[0]) / divisor;
        const rowHeight = (this.yDomain[1] - this.yDomain[0]) / divisor;
        const yOffset = 15;
        const xOffset = 10;

        const getHorizonatalAlignment = (row: number): { textAnchor: Square['textAnchor']; dx: number } => {
            if (row === 0) {
                return {
                    textAnchor: 'start',
                    dx: xOffset
                };
            }

            if (row === (divisor - 1)) {
                return {
                    textAnchor: 'end',
                    dx: -xOffset
                };
            }

            return {
                textAnchor: 'middle',
                dx: 0
            };
        };

        const getDy = (col: number) => {
            if (col <= (divisor / 2 - 1)) {
                return yOffset;
            }

            return -yOffset;
        };

        let matrix: Square[] = [];

        for (let row = 0; row < divisor; row++) {
            for (let col = 0; col < divisor; col++) {
                const { textAnchor, dx} = getHorizonatalAlignment(row);
                const dy = getDy(col);

                matrix.push({
                    position: [row, col],
                    x: this.xDomain[0] + ((row + 1) * colWidth),
                    y: this.yDomain[1] - ((col + 1) * rowHeight),
                    textAnchor,
                    dx,
                    dy,
                    width: colWidth,
                    height: rowHeight
                });
            }
        }

        return matrix;
    }

    onGroupMouseenter(group: IGroupedEntity) {
        this.activeGroup = group;

        /**
         * Reorder the groups so that active group is re-rendered on top
         */
        const fromIndex = this.groupedEntities.indexOf(this.activeGroup);
        const toIndex = this.groupedEntities.length - 1;
        this.groupedEntities.splice(fromIndex, 1);
        this.groupedEntities.splice(toIndex, 0, this.activeGroup);
    }

    onGroupMouseleave() {
        this.activeGroup = null;
    }
}

import { DecimalPipe } from '@angular/common';
import { Component, OnInit, VERSION } from '@angular/core';
import { scaleLinear } from 'd3-scale';

interface IQuadrant {
    area: Array<[number, number, number]>;
    id: string;
    labels: {
        className?: string;
        value: string;
        textAnchor: 'start' | 'middle' | 'end';
        point: [number, number]
    }[];
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
    public entities = [
        {
            "id": 1670416684028,
            "name": "united nations",
            "aggregation": {
                "current": {
                    "interactionsCount": 247,
                    "publicationsCount": 2
                },
                "previous": {
                    "interactionsCount": 0,
                    "publicationsCount": 0
                }
            },
            "score": 3.7366755108690595
        },
        {
            "id": 1670416698843,
            "name": "the united nations",
            "aggregation": {
                "current": {
                    "interactionsCount": 218,
                    "publicationsCount": 2
                },
                "previous": {
                    "interactionsCount": 0,
                    "publicationsCount": 0
                }
            },
            "score": 3.2979565237629758
        },
        {
            "id": 2040215362,
            "name": "menindee",
            "aggregation": {
                "current": {
                    "interactionsCount": 218,
                    "publicationsCount": 1
                },
                "previous": {
                    "interactionsCount": 0,
                    "publicationsCount": 0
                }
            },
            "score": 3.2979565237629758
        },
        {
            "id": 1672753673946,
            "name": "guli",
            "aggregation": {
                "current": {
                    "interactionsCount": 218,
                    "publicationsCount": 1
                },
                "previous": {
                    "interactionsCount": 0,
                    "publicationsCount": 0
                }
            },
            "score": 3.2979565237629758
        },
        {
            "id": 1670553469435,
            "name": "the murray-darling",
            "aggregation": {
                "current": {
                    "interactionsCount": 218,
                    "publicationsCount": 1
                },
                "previous": {
                    "interactionsCount": 0,
                    "publicationsCount": 0
                }
            },
            "score": 3.2979565237629758
        },
        {
            "id": 523029426,
            "name": "amazon",
            "aggregation": {
                "current": {
                    "interactionsCount": 218,
                    "publicationsCount": 1
                },
                "previous": {
                    "interactionsCount": 0,
                    "publicationsCount": 0
                }
            },
            "score": 3.2979565237629758
        },
        {
            "id": 1476069599,
            "name": "un",
            "aggregation": {
                "current": {
                    "interactionsCount": 65,
                    "publicationsCount": 4
                },
                "previous": {
                    "interactionsCount": 0,
                    "publicationsCount": 0
                }
            },
            "score": 0.9833356607550156
        },
        {
            "id": 1827472248,
            "name": "brigham young university",
            "aggregation": {
                "current": {
                    "interactionsCount": 36,
                    "publicationsCount": 0
                },
                "previous": {
                    "interactionsCount": 99,
                    "publicationsCount": 0
                }
            },
            "score": 0.5446166736489318
        },
        {
            "id": 993062250,
            "name": "salt lake temple",
            "aggregation": {
                "current": {
                    "interactionsCount": 36,
                    "publicationsCount": 0
                },
                "previous": {
                    "interactionsCount": 99,
                    "publicationsCount": 0
                }
            },
            "score": 0.5446166736489318
        },
        {
            "id": 1675188230242,
            "name": "byu faculty",
            "aggregation": {
                "current": {
                    "interactionsCount": 36,
                    "publicationsCount": 0
                },
                "previous": {
                    "interactionsCount": 0,
                    "publicationsCount": 0
                }
            },
            "score": 0.5446166736489318
        },
        {
            "id": 1670416845026,
            "name": "church",
            "aggregation": {
                "current": {
                    "interactionsCount": 36,
                    "publicationsCount": 0
                },
                "previous": {
                    "interactionsCount": 0,
                    "publicationsCount": 0
                }
            },
            "score": 0.5446166736489318
        },
        {
            "id": 1670419943596,
            "name": "sustainability office",
            "aggregation": {
                "current": {
                    "interactionsCount": 36,
                    "publicationsCount": 0
                },
                "previous": {
                    "interactionsCount": 0,
                    "publicationsCount": 0
                }
            },
            "score": 0.5446166736489318
        },
        {
            "id": 1679385992455,
            "name": "wallace stegner center symposium",
            "aggregation": {
                "current": {
                    "interactionsCount": 36,
                    "publicationsCount": 0
                },
                "previous": {
                    "interactionsCount": 0,
                    "publicationsCount": 0
                }
            },
            "score": 0.5446166736489318
        },
        {
            "id": 1671400834559,
            "name": "the presiding bishopric",
            "aggregation": {
                "current": {
                    "interactionsCount": 36,
                    "publicationsCount": 0
                },
                "previous": {
                    "interactionsCount": 0,
                    "publicationsCount": 0
                }
            },
            "score": 0.5446166736489318
        },
        {
            "id": 1670419291099,
            "name": "the university of utah",
            "aggregation": {
                "current": {
                    "interactionsCount": 36,
                    "publicationsCount": 0
                },
                "previous": {
                    "interactionsCount": 0,
                    "publicationsCount": 0
                }
            },
            "score": 0.5446166736489318
        },
        {
            "id": 1679385992460,
            "name": "sustainability leadership committee",
            "aggregation": {
                "current": {
                    "interactionsCount": 36,
                    "publicationsCount": 0
                },
                "previous": {
                    "interactionsCount": 0,
                    "publicationsCount": 0
                }
            },
            "score": 0.5446166736489318
        },
        {
            "id": 1679385992457,
            "name": "the utah legislature]",
            "aggregation": {
                "current": {
                    "interactionsCount": 36,
                    "publicationsCount": 0
                },
                "previous": {
                    "interactionsCount": 0,
                    "publicationsCount": 0
                }
            },
            "score": 0.5446166736489318
        },
        {
            "id": 1672770995867,
            "name": "church office building plaza",
            "aggregation": {
                "current": {
                    "interactionsCount": 36,
                    "publicationsCount": 0
                },
                "previous": {
                    "interactionsCount": 0,
                    "publicationsCount": 0
                }
            },
            "score": 0.5446166736489318
        },
        {
            "id": 1671190026922,
            "name": "earthecho",
            "aggregation": {
                "current": {
                    "interactionsCount": 35,
                    "publicationsCount": 0
                },
                "previous": {
                    "interactionsCount": 0,
                    "publicationsCount": 0
                }
            },
            "score": 0.5294884327142392
        },
        {
            "id": 1679398292780,
            "name": "the earthecho international water",
            "aggregation": {
                "current": {
                    "interactionsCount": 35,
                    "publicationsCount": 0
                },
                "previous": {
                    "interactionsCount": 0,
                    "publicationsCount": 0
                }
            },
            "score": 0.5294884327142392
        },
        {
            "id": 1439939285,
            "name": "earthecho international",
            "aggregation": {
                "current": {
                    "interactionsCount": 35,
                    "publicationsCount": 0
                },
                "previous": {
                    "interactionsCount": 0,
                    "publicationsCount": 0
                }
            },
            "score": 0.5294884327142392
        },
        {
            "id": 1670435985478,
            "name": "metropolitan ministries",
            "aggregation": {
                "current": {
                    "interactionsCount": 35,
                    "publicationsCount": 0
                },
                "previous": {
                    "interactionsCount": 0,
                    "publicationsCount": 0
                }
            },
            "score": 0.5294884327142392
        },
        {
            "id": 1679507132959,
            "name": "u.n. world water development",
            "aggregation": {
                "current": {
                    "interactionsCount": 29,
                    "publicationsCount": 1
                },
                "previous": {
                    "interactionsCount": 0,
                    "publicationsCount": 0
                }
            },
            "score": 0.4387189871060839
        },
        {
            "id": 1679351225491,
            "name": "antonio guterres",
            "aggregation": {
                "current": {
                    "interactionsCount": 29,
                    "publicationsCount": 1
                },
                "previous": {
                    "interactionsCount": 0,
                    "publicationsCount": 0
                }
            },
            "score": 0.4387189871060839
        },
        {
            "id": 1670418668321,
            "name": "opens",
            "aggregation": {
                "current": {
                    "interactionsCount": 29,
                    "publicationsCount": 1
                },
                "previous": {
                    "interactionsCount": 0,
                    "publicationsCount": 0
                }
            },
            "score": 0.4387189871060839
        },
        {
            "id": 1679507132956,
            "name": "the water development report(opens",
            "aggregation": {
                "current": {
                    "interactionsCount": 29,
                    "publicationsCount": 1
                },
                "previous": {
                    "interactionsCount": 0,
                    "publicationsCount": 0
                }
            },
            "score": 0.4387189871060839
        },
        {
            "id": 1679507132954,
            "name": "water foundation",
            "aggregation": {
                "current": {
                    "interactionsCount": 29,
                    "publicationsCount": 1
                },
                "previous": {
                    "interactionsCount": 0,
                    "publicationsCount": 0
                }
            },
            "score": 0.4387189871060839
        },
        {
            "id": 1671811429925,
            "name": "desolenator",
            "aggregation": {
                "current": {
                    "interactionsCount": 29,
                    "publicationsCount": 1
                },
                "previous": {
                    "interactionsCount": 0,
                    "publicationsCount": 0
                }
            },
            "score": 0.4387189871060839
        },
        {
            "id": 1679507132952,
            "name": "world water day(opens",
            "aggregation": {
                "current": {
                    "interactionsCount": 29,
                    "publicationsCount": 1
                },
                "previous": {
                    "interactionsCount": 0,
                    "publicationsCount": 0
                }
            },
            "score": 0.4387189871060839
        },
        {
            "id": 1679507132950,
            "name": "cloudfisher",
            "aggregation": {
                "current": {
                    "interactionsCount": 29,
                    "publicationsCount": 1
                },
                "previous": {
                    "interactionsCount": 0,
                    "publicationsCount": 0
                }
            },
            "score": 0.4387189871060839
        }
    ];
    public quadrants: IQuadrant[];
    public activeQuadrant: IQuadrant | null; 
    public axisLabels;

    constructor(private _decimalPipe: DecimalPipe) { }

    ngOnInit(): void {
        const interactionCounts = this.entities.map(e => e.aggregation.current.interactionsCount);
        const articleCounts = this.entities.map(e => e.aggregation.current.publicationsCount);

        this.xDomain = [Math.min(...articleCounts), Math.max(...articleCounts)];
        this.yDomain = [Math.min(...interactionCounts), Math.max(...interactionCounts)];

        this.quadrants = this.getQuadrants();
        this.axisLabels = this.getAxisLabels();
    }

    onQuadrantMouseenter(quadrant: IQuadrant): void {
        this.activeQuadrant = quadrant;
    }

    onChartMouseleave(): void {
        this.activeQuadrant = null;
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
            ]
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
            ]
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
            ]
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
            ]
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
}

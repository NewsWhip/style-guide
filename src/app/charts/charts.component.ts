import {Component, OnInit, ChangeDetectionStrategy, ViewChild, ViewChildren, QueryList} from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import * as moment from 'moment';
import { DecimalPipe } from '@angular/common';
import { bisector } from 'd3-array';
import { AxisTimeInterval } from 'd3-axis';
import { curveCardinal, curveBasis, curveLinear, curveStep, curveStepAfter, curveStepBefore } from 'd3-shape';
import { YAxisDirective, XAxisDirective, CircleDirective } from '../../_lib/modules/charts';
import { ScaleTime } from 'd3-scale';

@Component({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [DecimalPipe]
})
export class ChartsComponent implements OnInit {

    public selectedTab: string = "demo";

    private _timelineData = {
        "fbComments": {
            "1545085287756": 0,
            "1545085587748": 0,
            "1545085887881": 0,
            "1545086187810": 0,
            "1545086487824": 0,
            "1545086787850": 0,
            "1545087088176": 157,
            "1545087387868": 418,
            "1545087687762": 612,
            "1545087988068": 803,
            "1545088467902": 1059,
            "1545089487690": 1641,
            "1545090387958": 2067,
            "1545091287918": 2399,
            "1545092187876": 2654,
            "1545093987782": 3734,
            "1545094887685": 3959,
            "1545095667793": 4130,
            "1545097587695": 4549,
            "1545099387868": 4885,
            "1545105387773": 5707,
            "1545111387844": 6100,
            "1545120987862": 6487
        },
        "twShares": {
            "1545085122428": 0,
            "1545085439969": 0,
            "1545085979977": 5,
            "1545086290769": 6,
            "1545086741856": 6,
            "1545087521852": 155,
            "1545088302372": 300,
            "1545089082941": 439,
            "1545090043470": 569,
            "1545091244208": 773,
            "1545092684818": 843,
            "1545094126864": 1007,
            "1545095807739": 1134,
            "1545097729060": 1259,
            "1545099950618": 1333,
            "1545102473618": 1629,
            "1545105294554": 2773,
            "1545108114705": 2974,
            "1545111416106": 3572,
            "1545115196656": 3709,
            "1545119579490": 3851,
            "1545124562507": 3880
        },
        "fbTotalEngagement": {
            "1545085287756": 0,
            "1545085587748": 0,
            "1545085887881": 0,
            "1545086187810": 0,
            "1545086487824": 0,
            "1545086787850": 13,
            "1545087088176": 1751,
            "1545087387868": 4398,
            "1545087687762": 6506,
            "1545087988068": 8524,
            "1545088467902": 11472,
            "1545089487690": 17211,
            "1545090387958": 21563,
            "1545091287918": 24906,
            "1545092187876": 27788,
            "1545093987782": 39378,
            "1545094887685": 41586,
            "1545095667793": 43323,
            "1545097587695": 47307,
            "1545099387868": 50314,
            "1545105387773": 58536,
            "1545111387844": 62550,
            "1545120987862": 65198
        }
    };

    public xDomain: [number, number];
    public yDomain: [number, number];
    public chartMargins = { top: 50, bottom: 50, left: 60, right: 60 };
    public xAxisTickFormat = (d: Date) => moment(d).format('h:mma');
    public yAxisTickFormat = (d: number) => this._decimalPipe.transform(d, '1.0-0');

    public isHovering: boolean = false;
    public hoverPosition: [number, number] = [0,0];
    public mainScaleHoverCoordinates: [Date, number];
    public randomScaleHoverCoordinates: [Date, number];
    public numRandomPoints: number = 10;
    public randomData: Array<[number, number] | [number, number, number]>;
    public randomYDomain: [number, number];
    public randomAsBars: FormControl = new FormControl(false);
    public randomArea: FormControl = new FormControl(false);
    public randomLineCurve = {label: 'Linear', curve: curveLinear};
    public randomLineCurvesOptions = [
        {label: 'Linear', curve: curveLinear},
        {label: 'Basis', curve: curveBasis},
        {label: 'Cardinal', curve: curveCardinal},
        {label: 'Step', curve: curveStep},
        {label: 'Step before', curve: curveStepBefore},
        {label: 'Step after', curve: curveStepAfter}
    ];

    public metricNames: string[] = [];
    public form: FormGroup;
    public showBrush: FormControl = new FormControl(false);
    public showTooltip: FormControl = new FormControl(true);
    public brushType: FormControl = new FormControl('');
    public brushBox: [[Date, number], [Date, number]];
    public barWidth: FormControl = new FormControl(20);
    public xAxisTickCount: number | AxisTimeInterval = 8;
    public showForeignObject: FormControl = new FormControl(false);

    @ViewChild('xAxis') xAxis: XAxisDirective;
    @ViewChild('yAxis') yAxis: YAxisDirective;
    @ViewChildren('circle') fbCircles: QueryList<CircleDirective>;

    constructor(
        private _fb: FormBuilder,
        private _decimalPipe: DecimalPipe) { }

    ngOnInit() {
        this.metricNames = this.getMetricNames();
        this.createForm();

        this.generateRandomData()

        this.subscribeToFormChange();
    }

    createForm() {
        this.form = this._fb.group({
            selectedMetrics: new FormArray(
                this.metricNames
                    .map(mn => new FormControl(true))
            )
        });
    }

    subscribeToFormChange() {
        this.form.valueChanges.subscribe(val => {
            this.setActiveDomains();
        });
    }

    getMetricNames() {
        let names: string[] = [];

        for (const metric in this._timelineData) {
            names.push(metric);
        }

        return names;
    }

    setActiveDomains() {
        let xVals: number[] = this.randomData.map(d => d[0]);
        let yVals: number[] = [];

        for (const metric in this._timelineData) {
            if (this.isMetricSelected(metric)) {
                for (const timestamp in this._timelineData[metric]) {
                    const value = this._timelineData[metric][timestamp];

                    xVals.push(+timestamp);
                    yVals.push(value);
                }
            }
        }

        this.xDomain = xVals.length ? [Math.min(...xVals), Math.max(...xVals)] : [0, 0];
        this.yDomain = yVals.length ? [Math.min(...yVals), Math.max(...yVals)] : [0, 0];
    }

    isMetricSelected(metricName: string): boolean {
        let i = this.metricNames.indexOf(metricName);

        if (i > -1) {
            return (this.form.get('selectedMetrics') as FormArray).controls[i].value;
        }
        return false;
    }

    getDataByMetric(metric: string): Array<[number, number]> {
        let data = [];

        for (const timestamp in this._timelineData[metric]) {
            if (this._timelineData[metric].hasOwnProperty(timestamp)) {
                const value = this._timelineData[metric][timestamp];
                data.push([timestamp, value])
            }
        }

        return data.sort((a, b) => +a[0] - +b[0]);
    }

    onPathAnimationEnd(metric: string) {
        console.log(`${metric} animation ended`)
    }

    circleTrackValue(index: number, item: [number, number]) {
        return item[0] + item[1];
    }

    circleTrackIndex(index: number, item: [number, number]) {
        return index;
    }

    onMousemove(p: [number, number]) {
        this.hoverPosition = p;

        this.mainScaleHoverCoordinates = this.positionToCoordinates(this.xDomain, this.yDomain, p);
        this.randomScaleHoverCoordinates = this.positionToCoordinates(this.xDomain, this.randomYDomain, p);

        this.isHovering = true;
    }

    onMouseleave() {
        this.isHovering = false;
    }

    highlightClosest(data: Array<[number, number]>, coordinates: [Date, number]) {
        var bisectDate = bisector(d => d[0]).left;
        var i = bisectDate(data, coordinates[0]); // returns the index to the current data item

        var d0 = data[i - 1]
        var d1 = data[i];
        // work out which date value is closest to the mouse
        var d = +coordinates[0] - d0[0] > d1[0] - +coordinates[0] ? d1 : d0;

        var x = this.xAxis.scale(d[0]);
        var y = this.yAxis.scale(d[1]);

        console.log('Closest point', x, y)
    }

    positionToCoordinates(xDomain: [number, number], yDomain: [number, number], position: [number, number]): [Date, number] {
        return [
            (this.xAxis.scale as ScaleTime<number, number>).domain(xDomain).invert(position[0]),
            this.yAxis.scale.domain(yDomain).invert(position[1])
        ]
    }

    generateRandomData(): void {
        let xDomain: [number, number] = [1545085287756, 1545085287756 + (1000*60*60*24*0.5)];
        let yDomain: [number, number] = [0, 500];
        let datapoints: Array<[number, number]> = [];

        for (let index = 0; index < this.numRandomPoints; index++) {
            datapoints.push([this._randomInDomain(xDomain), this._randomInDomain(yDomain)])
        }
        this.randomData = datapoints.sort();
        this.randomYDomain = [
            0,
            Math.max(...this.randomData.map(x => x[1])),
        ];

        this.randomData.forEach(rd => {
            rd[2] = rd[1] * 0.5;
        })

        this.setActiveDomains();
    }

    addRandomDataPoint(): void {
        this.numRandomPoints++;

        let maxTime = Math.max(...this.randomData.map(rd => rd[0]));

        this.randomData.push([maxTime + 1000*60*60*2, this._randomInDomain([0, 900])]);

        this.randomYDomain = [
            0,
            Math.max(...this.randomData.map(x => x[1]))
        ];

        this.setActiveDomains();
    }

    resetRandomData() {
        this.numRandomPoints = 10;
        this.generateRandomData();
    }

    private _randomInDomain(domain: [number, number]): number {
        return Math.random() * (domain[1] - domain[0]) + domain[0];
    }

    onBrushSelection(corners: [[number, number], [number, number]]) {
        if (!corners) {
            return this.brushBox = null;
        }
        this.brushBox = [
            this.positionToCoordinates(this.xDomain, this.yDomain, corners[0]),
            this.positionToCoordinates(this.xDomain, this.yDomain, corners[1]),
        ]
        console.log(this.brushBox);
    }

    setSelectedTab(tab: string) {
        this.selectedTab = tab;
    }

    onBgClick() {
        console.info('Background click')
    }

    log(msg: string) {
        console.log(msg);
    }

}

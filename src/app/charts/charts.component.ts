import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormArray, FormGroup, FormControl } from '@angular/forms';
// import { trigger, transition, group, query, style, animate, keyframes } from "@angular/animations";

@Component({
    selector: 'app-charts',
    templateUrl: './charts.component.html',
    styleUrls: ['./charts.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChartsComponent implements OnInit {

    private _timelineData = {
        // "fbLikes": {
        //     "1545085287756": 0,
        //     "1545085587748": 0,
        //     "1545085887881": 0,
        //     "1545086187810": 0,
        //     "1545086487824": 0,
        //     "1545086787850": 6,
        //     "1545087088176": 1078,
        //     "1545087387868": 2664,
        //     "1545087687762": 3965,
        //     "1545087988068": 5212,
        //     "1545088467902": 7080,
        //     "1545089487690": 10574,
        //     "1545090387958": 13247,
        //     "1545091287918": 15320,
        //     "1545092187876": 17105,
        //     "1545093987782": 24323,
        //     "1545094887685": 25731,
        //     "1545095667793": 26806,
        //     "1545097587695": 29268,
        //     "1545099387868": 31137,
        //     "1545105387773": 36235,
        //     "1545111387844": 38836,
        //     "1545120987862": 40413
        // },
        // "fbShares": {
        //     "1545085287756": 0,
        //     "1545085587748": 0,
        //     "1545085887881": 0,
        //     "1545086187810": 0,
        //     "1545086487824": 0,
        //     "1545086787850": 7,
        //     "1545087088176": 516,
        //     "1545087387868": 1316,
        //     "1545087687762": 1929,
        //     "1545087988068": 2509,
        //     "1545088467902": 3333,
        //     "1545089487690": 4996,
        //     "1545090387958": 6249,
        //     "1545091287918": 7187,
        //     "1545092187876": 8029,
        //     "1545093987782": 11321,
        //     "1545094887685": 11896,
        //     "1545095667793": 12387,
        //     "1545097587695": 13490,
        //     "1545099387868": 14292,
        //     "1545105387773": 16594,
        //     "1545111387844": 17614,
        //     "1545120987862": 18298
        // },
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

    public xRange: [number, number];
    public yRange: [number, number];
    public metricNames: string[] = [];
    public form: FormGroup;

    constructor(private _fb: FormBuilder) { }

    ngOnInit() {
        this.metricNames = this.getMetricNames();

        this.createForm();
        this.setRange();
        this.subscribeToFormChange();
    }

    createForm() {
        this.form = this._fb.group({
            selectedMetrics: new FormArray(
                this.metricNames
                    .map(mn => new FormControl(true))
            )
        })
    }

    subscribeToFormChange() {
        this.form.valueChanges.subscribe(val => {
            this.setRange();
        })
    }

    getMetricNames() {
        let names: string[] = [];

        for (const metric in this._timelineData) {
            names.push(metric);
        }

        return names;
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

    isMetricSelected(metricName: string): boolean {
        let i = this.metricNames.indexOf(metricName);

        if (i > -1) {
            return (this.form.get('selectedMetrics') as FormArray).controls[i].value;
        }
        return false;
    }

    setRange() {
        let xVals: number[] = [];
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

        this.xRange = [Math.min(...xVals), Math.max(...xVals)]
        this.yRange = [Math.min(...yVals), Math.max(...yVals)]
    }

    circleTrack(index: number, item: [number, number]) {
        return item[0] + item[1];
    }

    formatTick(val) {
        return val;
    }

}

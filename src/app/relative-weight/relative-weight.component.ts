import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-relative-weight',
    templateUrl: './relative-weight.component.html',
    styleUrls: ['./relative-weight.component.scss'],
    standalone: false
})
export class RelativeWeightComponent implements OnInit {

  constructor() { }

  public scores: number[] = [
    76,
    65,
    87,
    12,
    32,
    45
  ];

  ngOnInit() {
  }

  getWeight(score: number) {
    return Math.round((score / this.max) * 100);
  }

  get max(): number {
    return this.scores.reduce((a, b) => Math.max(a, b));
  }

}

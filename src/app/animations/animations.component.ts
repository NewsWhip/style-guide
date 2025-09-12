import { Component, OnInit } from '@angular/core';
import { NW_DURATION, NW_EASING } from 'nw-style-guide/animations';

@Component({
    selector: 'app-animations',
    templateUrl: './animations.component.html',
    styleUrls: ['./animations.component.scss'],
    standalone: false
})
export class AnimationsComponent implements OnInit {

    public duration = NW_DURATION;
    public easing = NW_EASING;

  constructor() { }

  ngOnInit() {
  }

}

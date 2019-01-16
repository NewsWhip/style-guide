import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html'
})
export class ModalsComponent implements OnInit {

  public modalSize: string = 'md';
  public isInverse: boolean = false;

  constructor() { }

  ngOnInit() { }

  invertModal(value) {
    this.isInverse = value;
  }
}

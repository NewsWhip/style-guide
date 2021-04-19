import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-modals',
  templateUrl: './modals.component.html'
})
export class ModalsComponent implements OnInit {

  public modalSize: string = 'md';
  public isInverse: boolean = false;
  public isImage: boolean = false;
  public showTitle: boolean = true;

  constructor() { }

  ngOnInit() { }

  invertModal(value) {
    this.isInverse = value;
  }
}

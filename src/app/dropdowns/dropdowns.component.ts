import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dropdowns',
  templateUrl: './dropdowns.component.html'
})
export class DropdownsComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  stopProp(e: Event) {
    e.stopImmediatePropagation();
  }
}

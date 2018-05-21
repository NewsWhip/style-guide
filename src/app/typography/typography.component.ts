import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-typography',
  templateUrl: './typography.component.html',
  styleUrls: ['./typography.component.scss']
})
export class TypographyComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

  get randomLink(): string {
    return `https://www.google.ie/search?q=${Math.random() * (1000 - 99) + 99}`;
  }
}

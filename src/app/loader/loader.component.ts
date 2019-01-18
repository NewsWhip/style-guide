import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss']
})
export class LoaderComponent implements OnInit {
  public num: number = 6;
  public size: string = 'inline';
  constructor() {}

  ngOnInit() {}
}

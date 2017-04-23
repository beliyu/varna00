import { Component, OnInit } from '@angular/core';
import {
  D3Service,
  D3,
  Axis,
  BrushBehavior,
  BrushSelection,
  D3BrushEvent,
  ScaleLinear,
  ScaleOrdinal,
  Selection,
  Transition
} from 'd3-ng2-service';

@Component({
  selector: 'app-wrapper-brush-zoom-2',
  templateUrl: './wrapper-brush-zoom-2.component.html',
  styleUrls: ['./wrapper-brush-zoom-2.component.css']
})
export class WrapperBrushZoom2Component implements OnInit {
  private d3: D3;
  public heightV = 400;
  public widthV = 600;
  public data = [];

  constructor(d3Service: D3Service) {
    this.d3 = d3Service.getD3();
  }

  ngOnInit() {
    this.dataSet();
  }

  dataSet() {
    const d3 = this.d3;
    let points0: Array<[number, number, number]>;
    let points1: Array<[number, number, number]>;
    let points2: Array<[number, number, number]>;
    points0 = d3.range(10)
      .map(function (): [number, number, number] { return [Math.random() + 1, Math.random() + 1, 0]; });
    points1 = d3.range(10)
      .map(function (): [number, number, number] { return [Math.random() - 1.5, Math.random() + 1, 1]; });
    points2 = d3.range(10)
      .map(function (): [number, number, number] { return [Math.random(), Math.random() + 0.5, 2]; });
    this.data = d3.merge([points0, points1, points2]);
  }

  dimSet(w, h) {
    this.heightV = h;
    this.widthV = w;
  }

}

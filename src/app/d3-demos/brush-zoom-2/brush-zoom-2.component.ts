/**
 * This component is an adaptation of the "Brush & Zoom II" Example provided by
 * Mike Bostock at https://bl.ocks.org/mbostock/f48fcdb929a620ed97877e4678ab15e6
 */

import {
  Component, ElementRef, NgZone, OnDestroy, OnChanges,
  OnInit, Input, Output
} from '@angular/core';


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
  selector: 'app-brush-zoom-2',
  template: ' '
  // template: '<svg width="600" height="400"></svg>'
})
export class BrushZoom2Component implements OnInit, OnDestroy, OnChanges {
  @Input() public data;
  @Input() public width = 600;
  @Input() public height = 400;
  private d3: D3;
  private parentNativeElement: any;
  private d3Svg: Selection<SVGSVGElement, any, null, undefined>;

  constructor(element: ElementRef, private ngZone: NgZone, d3Service: D3Service) {
    this.d3 = d3Service.getD3();
    this.parentNativeElement = element.nativeElement;
  }

  ngOnDestroy() {
    if (this.d3Svg.empty && !this.d3Svg.empty()) {
      this.d3Svg.selectAll('*').remove();
    }
  }

  ngOnInit() {
    this.createChart();
    if (this.data) {
      this.updateChart();
    }
  }

  ngOnChanges() {
    if (this.d3Svg) {
      this.updateChart();
    }
  }

  updateChart() {
    const self = this;
    const d3 = this.d3;
    let d3ParentElement: Selection<HTMLElement, any, null, undefined>;
    let d3G: Selection<SVGGElement, any, null, undefined>;
    let k: number;
    let x0: [number, number];
    let y0: [number, number];
    let x: ScaleLinear<number, number>;
    let y: ScaleLinear<number, number>;
    let z: ScaleOrdinal<number, string>;
    let xAxis: Axis<number>;
    let yAxis: Axis<number>;
    let brush: BrushBehavior<any>;
    let idleTimeout: number | null;
    let idleDelay: number;

    function brushended(this: SVGGElement) {
      const e = <D3BrushEvent<any>>d3.event;
      const s: BrushSelection = e.selection;
      if (!s) {
        if (!idleTimeout) {
          self.ngZone.runOutsideAngular(() => {
            idleTimeout = window.setTimeout(idled, idleDelay);
          });
          return idleTimeout;
        }
        x.domain(x0);
        y.domain(y0);
      } else {
        x.domain([s[0][0], s[1][0]].map(x.invert, x));
        y.domain([s[1][1], s[0][1]].map(y.invert, y));
        self.d3Svg.select<SVGGElement>('.brush').call(brush.move, null);
      }
      zoom();
    }

    function idled() {
      idleTimeout = null;
    }

    function zoom() {
      const t: Transition<SVGSVGElement, any, null, undefined> = self.d3Svg.transition().duration(750);
      self.d3Svg.select<SVGGElement>('.x-axis').transition(t).call(xAxis);
      self.d3Svg.select<SVGGElement>('.y-axis').transition(t).call(yAxis);
      self.d3Svg.selectAll<SVGCircleElement, [number, number, number]>('circle').transition(t)
        .attr('cx', function (d) { return x(d[0]); })
        .attr('cy', function (d) { return y(d[1]); });
    }


    if (this.parentNativeElement !== null) {


      d3ParentElement = d3.select(this.parentNativeElement);
      d3ParentElement.select<SVGSVGElement>('svg')
        .attr('width', this.width)
        .attr('height', this.height);


      d3G = this.d3Svg.select<SVGGElement>('g');

      k = this.height / this.width;
      x0 = [-2.5, 2.5];
      y0 = [+d3.min(this.data, d => d[1]) - 0.2, +d3.max(this.data, d => d[1]) + 0.1];

      x = d3.scaleLinear().domain(x0).range([0, this.width]);
      y = d3.scaleLinear().domain(y0).range([this.height, 0]);
      z = d3.scaleOrdinal<number, string>(d3.schemeCategory20);

      xAxis = d3.axisTop<number>(x).ticks(10);
      yAxis = d3.axisRight<number>(y).ticks(10 * this.height / this.width);

      brush = d3.brush().on('end', brushended);
      idleDelay = 350;

      const update = d3G.selectAll<SVGCircleElement, any>('circle')
        .data(this.data);

      // remove exiting circle
      update.exit().remove();

      // update existing circle
      d3G.selectAll<SVGCircleElement, any>('circle')
        .attr('cx', function (d) { return x(d[0]); })
        .attr('cy', function (d) { return y(d[1]); })
        .attr('r', 5)
        .attr('fill', function (d) { return z(d[2]); });

      // add new circle
      update
        .enter().append<SVGCircleElement>('circle')
        .attr('cx', function (d) { return x(d[0]); })
        .attr('cy', function (d) { return y(d[1]); })
        .attr('r', 5)
        .attr('fill', function (d) { return z(d[2]); });


      this.d3Svg.selectAll('.x-axis')
        .attr('class', 'axis x-axis')
        .attr('transform', 'translate(0,' + (this.height - 10) + ')')
        .call(xAxis);

      this.d3Svg.selectAll('.y-axis')
        .attr('class', 'axis y-axis')
        .attr('transform', 'translate(10,0)')
        .call(yAxis);

      this.d3Svg.selectAll('.domain')
        .style('display', 'none');

      this.d3Svg.selectAll('.brush')
        .attr('class', 'brush')
        .call(brush);

    }

  }
  createChart() {
    let d3ParentElement: Selection<HTMLElement, any, null, undefined>;
    this.d3.select(this.parentNativeElement).append('svg')
      .attr('width', this.width)
      .attr('height', this.height);
    d3ParentElement = this.d3.select(this.parentNativeElement);
    this.d3Svg = d3ParentElement.select<SVGSVGElement>('svg');
    this.d3Svg.append<SVGGElement>('g');

    this.d3Svg.append<SVGGElement>('g')
      .attr('class', 'axis x-axis')
      .attr('transform', 'translate(0,' + (this.height - 10) + ')');
    this.d3Svg.append<SVGGElement>('g')
      .attr('class', 'axis y-axis');
    this.d3Svg.append<SVGGElement>('g')
      .attr('class', 'brush');

  }

}

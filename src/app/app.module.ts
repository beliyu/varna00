import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { D3Service } from 'd3-ng2-service';

import { AppComponent } from './app.component';
import { BrushZoom2Component } from './d3-demos/brush-zoom-2/brush-zoom-2.component';
import { WrapperBrushZoom2Component } from './d3-demos/wrapper-brush-zoom-2/wrapper-brush-zoom-2.component';

@NgModule({
  declarations: [
    AppComponent,
    BrushZoom2Component,
    WrapperBrushZoom2Component
  ],
  imports: [
    BrowserModule
  ],
  providers: [
    D3Service
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

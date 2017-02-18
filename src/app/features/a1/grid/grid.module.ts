import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeatComponent } from "./html/beat.component";
import { HtmlGridComponent } from './html/html-grid.component';
import { PixiGridComponent } from './pixi/pixi-grid.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    BeatComponent,
    HtmlGridComponent,
    PixiGridComponent
  ],
  exports: [
    HtmlGridComponent,
    PixiGridComponent
  ]
})

export class GridModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeatComponent } from "./beat.component";
import { HtmlGridComponent } from './html-grid.component';
import { PixiGridComponent } from './pixi/pixiGrid.component';


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

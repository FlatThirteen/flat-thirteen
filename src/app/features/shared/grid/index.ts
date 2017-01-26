import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HtmlGridComponent } from './htmlGrid.component';
import { PixiGridComponent } from './pixi/pixiGrid.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    HtmlGridComponent,
    PixiGridComponent
  ],
  exports: [
    HtmlGridComponent,
    PixiGridComponent
  ]
})

export class GridModule {}


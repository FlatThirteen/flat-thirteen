import { NgModule } from '@angular/core';

import { PixiGridComponent } from './pixi/pixiGrid.component';


@NgModule({
  declarations: [
    PixiGridComponent
  ], 
  exports: [
      PixiGridComponent
  ]
})

export class GridModule {};

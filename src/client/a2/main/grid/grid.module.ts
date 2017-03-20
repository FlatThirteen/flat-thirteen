import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HtmlGridComponent } from './html/html-grid.component';
import { PixiEffectsComponent } from './layers/pixi-effects.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    HtmlGridComponent,
    PixiEffectsComponent,
  ],
  exports: [
    HtmlGridComponent
  ]
})

export class GridModule {}

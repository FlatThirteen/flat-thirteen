import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BeatComponent } from "./html/beat.component";
import { HtmlGridComponent } from './html/html-grid.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    BeatComponent,
    HtmlGridComponent
  ],
  exports: [
    HtmlGridComponent
  ]
})

export class GridModule {}

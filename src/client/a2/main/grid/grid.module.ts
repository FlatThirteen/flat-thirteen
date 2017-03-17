import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HtmlGridComponent } from './html/html-grid.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    HtmlGridComponent
  ],
  exports: [
    HtmlGridComponent
  ]
})

export class GridModule {}

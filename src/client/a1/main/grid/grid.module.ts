import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HtmlGridComponent } from './html/html-grid.component';
import { ParticleFxModule } from '../../../component/particle-fx/particle-fx.module';

@NgModule({
  imports: [
    CommonModule,
    ParticleFxModule
  ],
  declarations: [
    HtmlGridComponent
  ],
  exports: [
    HtmlGridComponent
  ]
})

export class GridModule {}

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HtmlGridComponent } from './html/html-grid.component';
//import { CounterBallModule } from '../../../component/counter-ball/counter-ball.module';
import { ParticleFxModule } from '../../../component/particle-fx/particle-fx.module';

@NgModule({
  imports: [
    CommonModule,
    //CounterBallModule,
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

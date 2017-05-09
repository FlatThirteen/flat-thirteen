import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CounterBallComponent } from './counter-ball.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    CounterBallComponent
  ],
  exports: [
    CounterBallComponent
  ]
})
export class CounterBallModule {}


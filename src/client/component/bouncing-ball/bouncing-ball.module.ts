import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BouncingBallComponent } from './bouncing-ball.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    BouncingBallComponent
  ],
  exports: [
    BouncingBallComponent
  ]
})
export class BouncingBallModule {}


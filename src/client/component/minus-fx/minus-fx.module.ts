import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MinusFx } from './minus-fx.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    MinusFx
  ],
  exports: [
    MinusFx
  ]
})
export class MinusFxModule {}


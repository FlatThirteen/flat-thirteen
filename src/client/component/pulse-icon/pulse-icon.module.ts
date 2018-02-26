import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PulseIcon } from './pulse-icon.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    PulseIcon
  ],
  exports: [
    PulseIcon
  ]
})
export class PulseIconModule {}


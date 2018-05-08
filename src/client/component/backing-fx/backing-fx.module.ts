import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BackingFx } from './backing-fx.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    BackingFx
  ],
  exports: [
    BackingFx
  ]
})
export class BackingFxModule {}


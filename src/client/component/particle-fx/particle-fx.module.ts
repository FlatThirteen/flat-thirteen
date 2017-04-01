import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ParticleFxComponent } from './particle-fx.component';


@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [
    ParticleFxComponent
  ],
  exports: [
    ParticleFxComponent
  ]
})
export class ParticleFxModule {}


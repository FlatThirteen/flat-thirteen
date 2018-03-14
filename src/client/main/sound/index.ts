import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { routes } from './sound.routing';

import { SoundComponent } from './sound.component';
import { SoundService } from '../../common/sound/sound.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    SoundComponent
  ],
  providers: [
    SoundService
  ]
})

export class SoundModule {}


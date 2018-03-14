import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { routes } from './fx.routing';

import { FxComponent } from './fx.component';
import { SoundService } from '../../common/sound/sound.service';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    FxComponent
  ],
  providers: [
    SoundService
  ]
})

export class FxModule {}


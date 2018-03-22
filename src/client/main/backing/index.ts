import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { routes } from './backing.routing';

import { BackingComponent } from './backing.component';
import { SoundService } from '../../common/sound/sound.service';
import { TransportService } from '../../common/core/transport.service';
import { PlayIconModule } from '../../component/play-icon/play-icon.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    PlayIconModule,
    RouterModule.forChild(routes)
  ],
  declarations: [
    BackingComponent
  ],
  providers: [
    SoundService,
    TransportService
  ]
})

export class BackingModule {}


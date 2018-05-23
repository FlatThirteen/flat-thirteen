import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { routes } from './backing.routing';

import { PlayIconModule } from '../../component/play-icon/play-icon.module';
import { BackingFxModule } from '../../component/backing-fx/backing-fx.module';

import { BackingComponent } from './backing.component';

import { SoundService } from '../../common/sound/sound.service';
import { TransportService } from '../../common/core/transport.service';

@NgModule({
  imports: [
    BackingFxModule,
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


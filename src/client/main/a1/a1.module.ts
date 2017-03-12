import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EffectsModule } from '@ngrx/effects';

import { routes } from './a1.routing';
import { GridModule } from './grid/grid.module';
import { StagePanelModule } from '../../component/stage-panel/stage-panel.module';

import { A1Component } from './a1.component';
import { LessonActions } from '../../common/lesson/lesson.actions';
import { LessonService } from '../../common/lesson/lesson.service';
import { PlayerActions } from '../../common/player/player.actions';
import { PlayerEffects } from '../../common/player/player.effects';
import { PlayerService } from '../../common/player/player.service';
import { SoundService } from '../../common/sound/sound.service';
import { StageActions } from '../../common/stage/stage.actions';
import { StageService } from '../../common/stage/stage.service';
import { TransportService } from '../../common/core/transport.service';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    GridModule,
    StagePanelModule,
    EffectsModule.run(PlayerEffects),
  ],
  declarations: [
    A1Component
  ],
  providers: [
    LessonActions,
    LessonService,
    PlayerActions,
    PlayerEffects,
    PlayerService,
    TransportService,
    SoundService,
    StageActions,
    StageService
  ]
})

export class A1Module {}


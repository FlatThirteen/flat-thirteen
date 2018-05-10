import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IdlePreload, IdlePreloadModule } from '@angularclass/idle-preload';

import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { routes } from './a2-app.routing';
import { reducers, metaReducers } from '../common/app.reducer';

import { BouncingBallModule } from '../component/bouncing-ball/bouncing-ball.module';
import { GridModule } from './main/grid/grid.module';
import { StagePanelModule } from '../component/stage-panel/stage-panel.module';

import { A2MainComponent } from './main/a2-main.component';
import { LessonService } from '../common/lesson/lesson.service';
import { PlayerEffects } from '../common/player/player.effects';
import { PlayerService } from '../common/player/player.service';
import { SoundService } from '../common/sound/sound.service';
import { StageService } from '../common/stage/stage.service';
import { TransportService } from '../common/core/transport.service';

export const APP_IMPORTS = [
  ReactiveFormsModule,
  IdlePreloadModule.forRoot(), // forRoot ensures the providers are only created once
  RouterModule.forRoot(routes, { useHash: false, preloadingStrategy: IdlePreload }),
  StoreRouterConnectingModule,
  StoreModule.forRoot(reducers, { metaReducers }),
  EffectsModule.forRoot([PlayerEffects]),
  BouncingBallModule,
  GridModule,
  StagePanelModule,
];

export const APP_DECLARATIONS = [
  A2MainComponent
];

export const APP_ENTRY_COMPONENTS = [];

export const APP_PROVIDERS = [
  LessonService,
  PlayerEffects,
  PlayerService,
  SoundService,
  StageService,
  TransportService
];

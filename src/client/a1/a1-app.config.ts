import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IdlePreload, IdlePreloadModule } from '@angularclass/idle-preload';

import { StoreRouterConnectingModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { routes } from './a1-app.routing';
import { reducers, metaReducers } from '../common/app.reducer';

import { AutoIconModule } from '../component/auto-icon/auto-icon.module';
import { BouncingBallModule } from '../component/bouncing-ball/bouncing-ball.module';
import { GoalIconModule } from '../component/goal-icon/goal-icon.module';
import { GridModule } from './main/grid/grid.module';
import { MinusFxModule } from '../component/minus-fx/minus-fx.module';
import { PlayIconModule } from '../component/play-icon/play-icon.module';
import { PowerIconModule } from '../component/power-icon/power-icon.module';
import { PulseIconModule } from '../component/pulse-icon/pulse-icon.module';
import { StagePanelModule } from './main/stage-panel/stage-panel.module';
import { StripIconModule } from '../component/strip-icon/strip-icon.module';

import { A1MainComponent } from './main/a1-main.component';
import { LessonService } from './model/lesson/lesson.service';
import { PlayerEffects } from './model/player/player.effects';
import { PlayerService } from './model/player/player.service';
import { PowersService} from '../common/core/powers.service';
import { ProgressService } from './model/progress/progress.service';
import { SoundService } from '../common/sound/sound.service';
import { StageService } from './model/stage/stage.service';
import { TransportService } from '../common/core/transport.service';

export const APP_IMPORTS = [
  ReactiveFormsModule,
  IdlePreloadModule.forRoot(), // forRoot ensures the providers are only created once
  RouterModule.forRoot(routes, { useHash: false, preloadingStrategy: IdlePreload }),
  StoreRouterConnectingModule,
  StoreModule.forRoot(reducers, { metaReducers }),
  EffectsModule.forRoot([PlayerEffects]),
  AutoIconModule,
  BouncingBallModule,
  GoalIconModule,
  GridModule,
  MinusFxModule,
  PlayIconModule,
  PowerIconModule,
  PulseIconModule,
  StagePanelModule,
  StripIconModule,
];

export const APP_DECLARATIONS = [
  A1MainComponent
];

export const APP_ENTRY_COMPONENTS = [];

export const APP_PROVIDERS = [
  LessonService,
  PlayerEffects,
  PlayerService,
  PowersService,
  ProgressService,
  SoundService,
  StageService,
  TransportService
];

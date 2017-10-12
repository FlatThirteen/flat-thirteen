import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IdlePreload, IdlePreloadModule } from '@angularclass/idle-preload';

import { RouterStoreModule } from '@ngrx/router-store';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { routes } from './a1-app.routing';
import { rootReducer } from '../common/app.reducer';
import { GridModule } from './main/grid/grid.module';
import { BouncingBallModule } from '../component/bouncing-ball/bouncing-ball.module';
//import { CounterBallModule } from '../component/counter-ball/counter-ball.module';
import { MinusFxModule } from '../component/minus-fx/minus-fx.module';
import { PlayIconModule } from '../component/play-icon/play-icon.module';
import { StagePanelModule } from './main/stage-panel/stage-panel.module';

import { A1MainComponent } from './main/a1-main.component';
import { LessonActions } from './model/lesson/lesson.actions';
import { LessonService } from './model/lesson/lesson.service';
import { PlayerActions } from './model/player/player.actions';
import { PlayerEffects } from './model/player/player.effects';
import { PlayerService } from './model/player/player.service';
import { ProgressActions } from './model/progress/progress.actions';
import { ProgressService } from './model/progress/progress.service';
import { TransportService } from '../common/core/transport.service';
import { SoundService } from '../common/sound/sound.service';
import { StageActions } from './model/stage/stage.actions';
import { StageService } from './model/stage/stage.service';

export const APP_IMPORTS = [
  ReactiveFormsModule,
  IdlePreloadModule.forRoot(), // forRoot ensures the providers are only created once
  RouterModule.forRoot(routes, { useHash: false, preloadingStrategy: IdlePreload }),
  RouterStoreModule.connectRouter(),
  StoreModule.provideStore(rootReducer),
  GridModule,
  BouncingBallModule,
  //CounterBallModule,
  MinusFxModule,
  PlayIconModule,
  StagePanelModule,
  EffectsModule.run(PlayerEffects),
];

export const APP_DECLARATIONS = [
  A1MainComponent
];

export const APP_ENTRY_COMPONENTS = [];

export const APP_PROVIDERS = [
  LessonActions,
  LessonService,
  PlayerActions,
  PlayerEffects,
  PlayerService,
  ProgressActions,
  ProgressService,
  TransportService,
  SoundService,
  StageActions,
  StageService
];

import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { IdlePreload, IdlePreloadModule } from '@angularclass/idle-preload';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';

import { routes } from './a2-app.routing';
import { rootReducer } from '../common/app.reducer';
import { GridModule } from './main/grid/grid.module';
import { StagePanelModule } from '../component/stage-panel/stage-panel.module';

import { A2MainComponent } from './main/a2-main.component';
import { LessonActions } from '../common/lesson/lesson.actions';
import { LessonService } from '../common/lesson/lesson.service';
import { PlayerActions } from '../common/player/player.actions';
import { PlayerEffects } from '../common/player/player.effects';
import { PlayerService } from '../common/player/player.service';
import { TransportService } from '../common/core/transport.service';
import { SoundService } from '../common/sound/sound.service';
import { StageActions } from '../common/stage/stage.actions';
import { StageService } from '../common/stage/stage.service';

export const APP_IMPORTS = [
  ReactiveFormsModule,
  IdlePreloadModule.forRoot(), // forRoot ensures the providers are only created once
  RouterModule.forRoot(routes, { useHash: false, preloadingStrategy: IdlePreload }),
  StoreModule.provideStore(rootReducer),
  GridModule,
  StagePanelModule,
  EffectsModule.run(PlayerEffects),
];

export const APP_DECLARATIONS = [
  A2MainComponent
];

export const APP_ENTRY_COMPONENTS = [];

export const APP_PROVIDERS = [
  LessonActions,
  LessonService,
  PlayerActions,
  PlayerEffects,
  PlayerService,
  TransportService,
  SoundService,
  StageActions,
  StageService
];

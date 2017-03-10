import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from "@angular/router";
import { IdlePreload, IdlePreloadModule } from '@angularclass/idle-preload';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from "@ngrx/effects";

import { routes } from './a2-app.routing';
import { rootReducer } from './a2-app.reducer';
import { GridModule } from "./main/grid/grid.module";
import { StagePanelModule } from "../../app/features/shared/stage-panel/stage-panel.module";

import { A2MainComponent } from "./main/a2-main.component";
import { LessonActions } from "../../app/lesson/lesson.actions";
import { LessonService } from "../../app/lesson/lesson.service";
import { PlayerActions } from "../../app/player/player.actions";
import { PlayerEffects } from "../../app/player/player.effects";
import { PlayerService } from "../../app/player/player.service";
import { TransportService } from "../../app/core/transport.service";
import { SoundService } from "../../app/sound/sound.service";
import { StageActions } from "../../app/stage/stage.actions";
import { StageService } from "../../app/stage/stage.service";

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

import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { Surface } from "../surface/surface.model";
import { SurfaceService } from "../surface/surface.service";
import { StageService } from "../stage/stage.service";

@Injectable()
export class PlayerActions {

  constructor(private stage: StageService, private surface: SurfaceService) {}

  static INIT = '[PLAYER] Init';
  init(surfaces: Surface[]): Action {
    this.surface.init(surfaces);
    return {
      type: PlayerActions.INIT,
      payload: this.surface.initialData
    };
  }

  static SELECT = '[PLAYER] Select';
  select(key: string): Action {
    let surface = this.surface.forKey(key);
    return !surface ? noAction : {
      type: PlayerActions.SELECT,
      payload: [surface, key]
    };
  }

  static UNSELECT = '[PLAYER] Unselect';
  unselect(): Action {
    return {
      type: PlayerActions.UNSELECT
    }
  }

  static SET = '[PLAYER] Set';
  set(key: string, cursor: number): Action {
    this.stage.activate();
    let surface = this.surface.forKey(key);
    return !surface ? noAction : {
      type: PlayerActions.SET,
      payload: [this.surface.forKey(key), key, cursor]
    };
  }

  static UNSET = '[PLAYER] Unset';
  unset(key: string, cursor: number): Action {
    this.stage.activate();
    let surface = this.surface.forKey(key);
    return !surface ? noAction : {
      type: PlayerActions.UNSET,
      payload: [this.surface.forKey(key), key, cursor]
    };
  }

  static PULSES = '[PLAYER] Pulses';
  pulses(key: string, pulses: number): Action {
    this.stage.activate();
    return !key ? noAction : {
      type: PlayerActions.PULSES,
      payload: [this.surface.forKey(key), key, pulses]
    };
  }
}

const noAction = { type: null };

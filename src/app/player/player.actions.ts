import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { Surface } from "../features/shared/surface.model";
import { SurfaceService } from "../features/shared/surface.service";

@Injectable()
export class PlayerActions {

  constructor(private surface: SurfaceService) {}

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
      payload: [key, surface]
    };
  }

  static UNSELECT = '[PLAYER] Unselect';
  unselect(key: string): Action {
    return {
      type: PlayerActions.UNSELECT,
      payload: key
    }
  }

  static SET = '[PLAYER] Set';
  set(key: string): Action {
    let surface = this.surface.forKey(key);
    return !surface ? noAction : {
      type: PlayerActions.SET,
      payload: [key, this.surface.forKey(key)]
    };
  }

  static UNSET = '[PLAYER] Unset';
  unset(key: string): Action {
    let surface = this.surface.forKey(key);
    return !surface ? noAction : {
      type: PlayerActions.UNSET,
      payload: [key, this.surface.forKey(key)]
    };
  }

  static PULSES = '[PLAYER] Pulses';
  pulses(key: string, pulses: number): Action {
    return !key ? noAction : {
      type: PlayerActions.PULSES,
      payload: [key, pulses, this.surface.forKey(key)]
    };
  }
}

const noAction = { type: null };

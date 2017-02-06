import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { Surface } from "../features/shared/surface";
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
    return {
      type: PlayerActions.SELECT,
      payload: this.surface.forKey(key) ? key : null
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
    return {
      type: PlayerActions.SET,
      payload: [key, this.surface.forKey(key)]
    }
  }

  static UNSET = '[PLAYER] Unset';
  unset(key: string) {
    return {
      type: PlayerActions.UNSET,
      payload: [key, this.surface.forKey(key)]
    };
  }

  static PULSES = '[PLAYER] Pulses';
  pulses(key: string, pulses: number) {
    return {
      type: PlayerActions.PULSES,
      pulses: [key, pulses, this.surface.forKey(key)]
    };
  }
}

import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { LessonService } from "../lesson/lesson.service";

@Injectable()
export class PlayerActions {

  constructor(private lesson: LessonService) {}

  static INIT = '[PLAYER] Init';
  init(): Action {
    return {
      type: PlayerActions.INIT,
      payload: this.lesson.initialData
    };
  }

  static SELECT = '[PLAYER] Select';
  select(key: string, cursor?: number): Action {
    let surface = this.lesson.surfaceFor(key);
    return !surface ? noAction : {
      type: PlayerActions.SELECT,
      payload: [surface, key, cursor]
    };
  }

  static UNSELECT = '[PLAYER] Unselect';
  unselect(): Action {
    return {
      type: PlayerActions.UNSELECT
    }
  }

  static SET = '[PLAYER] Set';
  set(key: string, cursor: number, pulses: number | number[]): Action {
    let surface = this.lesson.surfaceFor(key);
    return !surface ? noAction : {
      type: PlayerActions.SET,
      payload: [surface, key, cursor, pulses]
    };
  }

  static UNSET = '[PLAYER] Unset';
  unset(key: string, cursor: number): Action {
    let surface = this.lesson.surfaceFor(key);
    return !surface ? noAction : {
      type: PlayerActions.UNSET,
      payload: [surface, key, cursor]
    };
  }

  static PULSES = '[PLAYER] Pulses';
  pulses(key: string, pulses: number): Action {
    return !key ? noAction : {
      type: PlayerActions.PULSES,
      payload: [this.lesson.surfaceFor(key), key, pulses]
    };
  }
}

const noAction = { type: null };

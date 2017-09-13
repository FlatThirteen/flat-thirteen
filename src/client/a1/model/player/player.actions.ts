import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { LessonService } from '../lesson/lesson.service';

const noAction = { type: null };

@Injectable()
export class PlayerActions {

  constructor(private lesson: LessonService) {}

  static INIT = '[A1 PLAYER] Init';
  init(): Action {
    return {
      type: PlayerActions.INIT,
      payload: this.lesson.initialData
    };
  }

  static SELECT = '[A1 PLAYER] Select';
  select(key: string, cursor?: number): Action {
    let surface = this.lesson.surfaceFor(key);
    return !surface ? noAction : {
      type: PlayerActions.SELECT,
      payload: [surface, key, cursor]
    };
  }

  static UNSELECT = '[A1 PLAYER] Unselect';
  unselect(): Action {
    return {
      type: PlayerActions.UNSELECT
    };
  }

  static SET = '[A1 PLAYER] Set';
  set(key: string, cursor: number, pulses: number | number[]): Action {
    let surface = this.lesson.surfaceFor(key);
    return !surface ? noAction : {
      type: PlayerActions.SET,
      payload: [surface, key, cursor, pulses]
    };
  }

  static UNSET = '[A1 PLAYER] Unset';
  unset(key: string, cursor: number): Action {
    let surface = this.lesson.surfaceFor(key);
    return !surface ? noAction : {
      type: PlayerActions.UNSET,
      payload: [surface, key, cursor]
    };
  }
}

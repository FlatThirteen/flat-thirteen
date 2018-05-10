import { Action } from '@ngrx/store';

import { PowerUpType } from '../../../common/core/powers.service';

import { Result } from '../lesson/lesson.reducer';

import { Settings } from './progress.reducer';

export namespace Progress {

  export const INIT = '[A1 PROGRESS] Init';
  export class InitAction implements Action {
    readonly type = Progress.INIT;
    constructor(public payload: { settings: Settings }) {}
  }

  export const POWER = '[A1 PROGRESS] Power';
  export class PowerAction implements Action {
    readonly type = Progress.POWER;
    constructor(public payload: { type: PowerUpType, beat: number }) {}
  }

  export const RESULT = '[A1 PROGRESS] Result';
  export class ResultAction implements Action {
    readonly type = Progress.RESULT;
    constructor(public payload: { result: Result }) {}
  }

  export const NEXT = '[A1 PROGRESS] Next';
  export class NextAction implements Action {
    readonly type = Progress.NEXT;
  }

  export type Actions = InitAction | PowerAction | ResultAction | NextAction;
}

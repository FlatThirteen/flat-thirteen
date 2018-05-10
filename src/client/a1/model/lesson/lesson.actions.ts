import { Action } from '@ngrx/store';

import { Plan } from './lesson.reducer';

export namespace Lesson {

  export const INIT = '[A1 LESSON] Init';
  export class InitAction implements Action {
    readonly type = Lesson.INIT;
    constructor(public payload: { plan: Plan }) {}
  }

  export const RESET = '[A1 LESSON] Reset';
  export class ResetAction implements Action {
    readonly type = Lesson.RESET;
  }

  export const STAGE = '[A1 LESSON] Stage';
  export class StageAction implements Action {
    readonly type = Lesson.STAGE;
    constructor(public payload: { stage: number }) {}
  }

  export const COMPLETE = '[A1 LESSON] Complete';
  export class CompleteAction implements Action {
    readonly type = Lesson.COMPLETE;
    constructor(public payload: { rounds: number, stage: number, points: number }) {}
  }

  export type Actions = InitAction | ResetAction | StageAction | CompleteAction;
}

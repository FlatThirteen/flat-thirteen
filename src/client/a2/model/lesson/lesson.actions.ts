import { Action } from '@ngrx/store';

import { Plan } from './lesson.reducer';

export namespace Lesson {

  export const INIT = '[LESSON] Init';
  export class InitAction implements Action {
    readonly type = Lesson.INIT;
    constructor(public payload: { plan: Plan }) {}
  }

  export const RESET = '[LESSON] Reset';
  export class ResetAction implements Action {
    readonly type = Lesson.RESET;
  }

  export const ADVANCE = '[LESSON] Advance';
  export class AdvanceAction implements Action {
    readonly type = Lesson.ADVANCE;
    constructor(public payload: { rounds: number }) {}
  }

  export type Actions = InitAction | ResetAction | AdvanceAction;
}

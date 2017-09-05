import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { Plan } from './lesson.reducer';

@Injectable()
export class LessonActions {

  constructor() {}

  static INIT = '[LESSON] Init';
  init(plan: Plan): Action {
    return {
      type: LessonActions.INIT,
      payload: plan
    };
  }

  static RESET = '[LESSON] Reset';
  reset(): Action {
    return {
      type: LessonActions.RESET
    };
  }

  static ADVANCE = '[LESSON] Advance';
  advance(rounds: number): Action {
    return {
      type: LessonActions.ADVANCE,
      payload: rounds
    };
  }
}

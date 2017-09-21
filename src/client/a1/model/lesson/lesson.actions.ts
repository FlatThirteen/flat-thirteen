import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { Plan } from './lesson.reducer';

@Injectable()
export class LessonActions {

  constructor() {}

  static INIT = '[A1 LESSON] Init';
  init(plan: Plan): Action {
    return {
      type: LessonActions.INIT,
      payload: plan
    };
  }

  static RESET = '[A1 LESSON] Reset';
  reset(): Action {
    return {
      type: LessonActions.RESET
    };
  }

  static STAGE = '[A1 LESSON] Stage';
  stage(stage: number): Action {
    return {
      type: LessonActions.STAGE,
      payload: stage
    }
  }

  static COMPLETE = '[A1 LESSON] Complete';
  complete(rounds: number, stage: number, points: number): Action {
    return {
      type: LessonActions.COMPLETE,
      payload: [rounds, stage, points]
    }
  }
}

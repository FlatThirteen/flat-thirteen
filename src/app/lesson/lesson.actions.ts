import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { EndCondition } from "./lesson.reducer";
import { Surface } from "../surface/surface.model";

@Injectable()
export class LessonActions {

  constructor() {}

  static INIT = '[LESSON] Init';
  init(surface: Surface[], end: EndCondition): Action {
    return {
      type: LessonActions.INIT,
      payload: [surface, end]
    };
  }

  static RESET = '[LESSON] Reset';
  reset(): Action {
    return {
      type: LessonActions.RESET
    }
  }

  static ADVANCE = '[LESSON] Advance';
  advance(rounds: number): Action {
    return {
      type: LessonActions.ADVANCE,
      payload: rounds
    };
  }
}

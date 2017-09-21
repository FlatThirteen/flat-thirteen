import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { Settings } from './progress.reducer';
import { Result } from '../lesson/lesson.reducer';

@Injectable()
export class ProgressActions {

  constructor() {}

  static INIT = '[A1 PROGRESS] Init';
  init(settings: Settings): Action {
    return {
      type: ProgressActions.INIT,
      payload: settings
    };
  }

  static RESULT = '[A1 PROGRESS] Result';
  result(result: Result): Action {
    return {
      type: ProgressActions.RESULT,
      payload: result
    }
  }

  static NEXT = '[A1 PROGRESS] Next';
  next(): Action {
    return {
      type: ProgressActions.NEXT
    }
  }
}

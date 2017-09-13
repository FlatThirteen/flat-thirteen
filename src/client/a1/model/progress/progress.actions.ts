import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';

import { Settings } from './progress.reducer';

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

  static NEXT = '[A1 PROGRESS] Next';
  next(): Action {
    return {
      type: ProgressActions.NEXT
    }
  }
}

import * as _ from 'lodash';

import { Action } from '@ngrx/store';

import { Result } from '../lesson/lesson.reducer';
import { Rhythm } from '../../../common/core/rhythm.model';

import { ProgressActions } from './progress.actions';

export interface Settings {
  rhythm: Rhythm,
  minNotes: number,
  maxNotes: number
}

export class ProgressState {
  readonly lessonNumber: number = 0;
  readonly results: Result[] = [];

  constructor(readonly settings: Settings) {}

  static reducer(state: ProgressState, action: Action): ProgressState {
    switch (action.type) {
      case ProgressActions.INIT: {
        return new ProgressState(action.payload);
      }
      case ProgressActions.RESULT: {
        let result = action.payload;
        let newResults = state.results.slice();
        newResults.push(result);
        return _.defaults({
          results: newResults
        }, state);
      }
      case ProgressActions.NEXT: {
        return _.defaults({
          lessonNumber: state.lessonNumber + 1
        }, state);
      }
      default: {
        return state;
      }
    }
  }
}

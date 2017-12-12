import * as _ from 'lodash';

import { Action } from '@ngrx/store';

import { Powers } from '../../../common/core/powers.service';
import { Rhythm } from '../../../common/core/rhythm.model';

import { Result } from '../lesson/lesson.reducer';

import { ProgressActions } from './progress.actions';

export interface Settings {
  rhythm: Rhythm,
  minNotes: number,
  maxNotes: number,
  powers: Powers
}

export class ProgressState {
  readonly lessonNumber: number = 0;
  readonly results: Result[] = [];
  readonly points: number = 0;

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
        let newPoints = state.points + _.sum(result.points);
        return _.defaults({
          results: newResults,
          points: newPoints,
          settings: _.defaults({
            powers: Powers.update(state.settings.powers, state.lessonNumber + 1, newPoints)
          }, state.settings)
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

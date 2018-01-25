import * as _ from 'lodash';

import { Action } from '@ngrx/store';

import { Powers, PowerType } from '../../../common/core/powers.service';
import { Rhythm } from '../../../common/core/rhythm.model';

import { Result } from '../lesson/lesson.reducer';

import { ProgressActions } from './progress.actions';
import { ProgressData } from './progress.data';

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
  readonly powerUps: PowerType[] = [];

  constructor(readonly settings: Settings) {}

  static reducer(state: ProgressState, action: Action): ProgressState {
    switch (action.type) {
      case ProgressActions.INIT: {
        return new ProgressState(action.payload);
      }
      case ProgressActions.POWER: {
        let powerType = action.payload;
        let removed = false;
        return _.defaults({
          settings: _.defaults({
            powers: state.settings.powers.up(powerType)
          }, state.settings),
          powerUps: _.filter(state.powerUps, (value) => {
            if (!removed && value === powerType) {
              removed = true;
              return false;
            }
            return true;
          }),
        }, state);
      }
      case ProgressActions.RESULT: {
        let result = action.payload;
        let newResults = state.results.slice();
        newResults.push(result);
        let newPoints = state.points + _.sum(result.points);
        return _.defaults({
          results: newResults,
          points: newPoints,
          powerUps: ProgressData.powerUps(state.settings.powers,
              state.lessonNumber + 1, newPoints),
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

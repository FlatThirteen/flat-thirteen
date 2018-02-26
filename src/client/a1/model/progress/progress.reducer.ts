import * as _ from 'lodash';

import { Action } from '@ngrx/store';

import { Powers, PowerUp } from '../../../common/core/powers.service';

import { Result } from '../lesson/lesson.reducer';

import { ProgressActions } from './progress.actions';
import { ProgressData } from './progress.data';

export interface Settings {
  minNotes: number,
  maxNotes: number,
  powers: Powers
}

export class ProgressState {
  readonly lessonNumber: number;
  readonly results: Result[] = [];
  readonly points: number = 0;
  readonly powerUps: PowerUp[] = [];

  constructor(readonly settings: Settings) {}

  static reducer(state: ProgressState, action: Action): ProgressState {
    switch (action.type) {
      case ProgressActions.INIT: {
        return new ProgressState(action.payload);
      }
      case ProgressActions.POWER: {
        let [type, beat] = action.payload;
        let removed = false;
        return _.defaults({
          settings: _.defaults({
            powers: state.settings.powers.up(beat ? type + beat : type)
          }, state.settings),
          powerUps: _.filter(state.powerUps, (powerUp) => {
            if (!removed && powerUp.type === type) {
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
          lessonNumber: state.lessonNumber === undefined ? 0 : state.lessonNumber + 1
        }, state);
      }
      default: {
        return state;
      }
    }
  }
}

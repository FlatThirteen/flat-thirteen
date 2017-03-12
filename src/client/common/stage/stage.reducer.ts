import * as _ from 'lodash';
import { Action } from '@ngrx/store';

import { LessonActions } from '../lesson/lesson.actions';
import { Phrase } from '../phrase/phrase.model';
import { PlayerActions } from '../player/player.actions';
import { StageActions } from './stage.actions';

export type StageScene = 'Demo' | 'Loop' | 'Count' | 'Goal' | 'Play' | 'Victory';

export class StageState {
  readonly round: number = 0;
  readonly active: boolean = true;
  readonly goalPhrase: Phrase = null;
  readonly playedPhrase: Phrase = null;

  constructor(readonly scene: StageScene, readonly nextScene: StageScene) {}

  static reducer(state: StageState, action: Action): StageState {
    switch (action.type) {
      case LessonActions.INIT:
      case LessonActions.RESET: {
        return new StageState('Demo', 'Count');
      }
      case StageActions.LISTEN: {
        if (state.scene === 'Demo') {
          return new StageState('Loop', 'Loop');
        } else {
          return _.defaults({ active: true }, state);
        }
      }
      case StageActions.NEXT: {
        let phraseBuilder = action.payload;
        let nextIsGoal = state.nextScene === 'Count' || state.nextScene === 'Victory';
        return {
          scene: !state.active ? 'Goal' : state.nextScene,
          nextScene: nextIsGoal ? 'Goal' : 'Play',
          round: phraseBuilder ? 0 : state.round + 1,
          active: false,
          goalPhrase: phraseBuilder ? phraseBuilder.build() : state.goalPhrase,
          playedPhrase: nextIsGoal ? null : new Phrase()
        };
      }
      case StageActions.VICTORY: {
        return new StageState('Victory', 'Goal');
      }
      case StageActions.PLAY: {
        let [note, beat, tick] = action.payload;
        return _.defaults({
          playedPhrase: _.cloneDeep(state.playedPhrase).add(note, beat, tick)
        }, state);
      }
      case PlayerActions.SET:
      case PlayerActions.UNSET:
      case PlayerActions.PULSES: {
        return _.defaults({
          active: state.nextScene !== 'Goal'
        }, state);
      }
      default: {
        return state;
      }
    }
  }
}

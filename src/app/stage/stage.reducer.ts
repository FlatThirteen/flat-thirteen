import * as _ from 'lodash';
import { Action } from '@ngrx/store';

import { LessonActions } from "../lesson/lesson.actions";
import { Phrase } from "../phrase/phrase.model";
import { PlayerActions } from '../player/player.actions';
import { StageActions } from './stage.actions';

export type StageScene = 'Demo' | 'Count' | 'Goal' | 'Play' | 'Victory';

export class StageState {
  readonly scene: StageScene;
  readonly nextScene: StageScene;
  readonly round: number;
  readonly active: boolean;
  readonly goalPhrase: Phrase;
  readonly playedPhrase: Phrase;

  static reducer(state: StageState, action: Action): StageState {
    switch (action.type) {
      case LessonActions.INIT:
      case LessonActions.RESET: {
        return {
          scene: 'Demo',
          nextScene: 'Count',
          round: 0,
          active: true,
          goalPhrase: null,
          playedPhrase: null
        };
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
        return {
          scene: 'Victory',
          nextScene: 'Goal',
          round: 0,
          active: true,
          goalPhrase: null,
          playedPhrase: null
        };
      }
      case StageActions.PLAY: {
        let [note, beat, tick] = action.payload;
        return <StageState>_.defaults({
          playedPhrase: _.cloneDeep(state.playedPhrase).add(note, beat, tick)
        }, state);
      }
      case PlayerActions.SET:
      case PlayerActions.UNSET:
      case PlayerActions.PULSES: {
        return <StageState>_.defaults({
          active: state.nextScene !== 'Goal'
        }, state);
      }
      default: {
        return state;
      }
    }
  }
}

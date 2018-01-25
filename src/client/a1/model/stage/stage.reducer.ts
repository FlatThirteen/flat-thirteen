import * as _ from 'lodash';
import { Action } from '@ngrx/store';

import { Phrase } from '../../../common/phrase/phrase.model';
import { VictoryPhraseBuilder } from '../../../common/phrase/victory.phrase';

import { Penalty } from './penalty.model';
import { StageActions } from './stage.actions';

export type StageScene = 'standby' | 'count' | 'goal' | 'playback' | 'victory' | '';

export class StageState {
  readonly scene: StageScene = 'standby';
  readonly nextScene: StageScene = 'standby';
  readonly goalCount: number = 0;
  readonly playbackCount: number = 0;
  readonly goalPenalty: Penalty;
  readonly wrongPenalty: Penalty;
  readonly playedPhrase: Phrase = null;
  readonly victoryPhrase: Phrase = null;
  readonly goalPlayed: boolean = false;

  constructor(readonly goalPhrase: Phrase) {
    this.goalPenalty = new Penalty(45);
    this.wrongPenalty = new Penalty(50);
  }

  static reducer(state: StageState, action: Action): StageState {
    let nextScene, penalty;
    switch(action.type) {
      case StageActions.STANDBY:
        let phrase = action.payload;
        if (phrase) {
          return new StageState(phrase);
        } else {
          return _.defaults({
            scene: 'standby',
            nextScene: 'standby'
          }, state)
        }
      case StageActions.COUNT:
        nextScene = action.payload;
        return _.defaults({
          scene: 'count',
          nextScene: nextScene
        }, state);
      case StageActions.GOAL:
        [nextScene, penalty] = action.payload;
        return _.defaults({
          scene: 'goal',
          nextScene: nextScene,
          goalCount: state.goalCount + 1,
          goalPenalty: penalty ? state.goalPenalty.accrue(penalty) : state.goalPenalty
        }, state);
      case StageActions.PLAYBACK:
        nextScene = action.payload;
        return _.defaults({
          scene: 'playback',
          nextScene: nextScene,
          playbackCount: state.playbackCount + 1,
          playedPhrase: new Phrase()
        }, state);
      case StageActions.VICTORY:
        let basePoints = action.payload;
        return _.defaults({
          scene: 'victory',
          nextScene: 'standby',
          victoryPhrase: new VictoryPhraseBuilder(_.floor(basePoints / 10)).build()
        }, state);
      case StageActions.NEXT:
        nextScene = action.payload;
        return _.defaults({
          nextScene: nextScene
        }, state);
      case StageActions.PLAY:
        let [note, beat, tick] = action.payload;
        let playedPhrase = state.playedPhrase ?
            _.cloneDeep(state.playedPhrase).add(note, beat, tick) : null;
        let goalPlayed = _.isEqual(state.goalPhrase, playedPhrase);
        return _.defaults({
          playedPhrase: playedPhrase,
          goalPlayed: goalPlayed
        }, state);
      case StageActions.WRONG:
        penalty = action.payload;
        return _.defaults({
          wrongPenalty: state.wrongPenalty.accrue(penalty)
        }, state);
      default: {
        return state;
      }
    }
  }
}

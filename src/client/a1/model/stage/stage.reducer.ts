import * as _ from 'lodash';
import { Action } from '@ngrx/store';

import { Phrase } from '../../../common/phrase/phrase.model';
import { StageActions } from './stage.actions';
import { VictoryPhraseBuilder } from '../../../common/phrase/victory.phrase';

export type StageScene = 'standby' | 'goal' | 'playback' | 'victory';

export class StageState {
  readonly goalCount: number = 0;
  readonly playbackCount: number = 0;
  readonly playedPhrase: Phrase = null;
  readonly victoryPhrase: Phrase = null;
  readonly goalPlayed: boolean = false;

  constructor(readonly scene: StageScene, readonly goalPhrase: Phrase) {}

  static reducer(state: StageState, action: Action): StageState {
    switch(action.type) {
      case StageActions.STANDBY:
        let phraseBuilder = action.payload;
        if (phraseBuilder) {
          return new StageState('standby', phraseBuilder.build());
        } else {
          return _.defaults({
            scene: 'standby'
          }, state)
        }
      case StageActions.GOAL:
        return _.defaults({
          scene: 'goal',
          goalCount: state.goalCount + 1
        }, state);
      case StageActions.PLAYBACK:
        return _.defaults({
          scene: 'playback',
          playbackCount: state.playbackCount + 1,
          playedPhrase: new Phrase()
        }, state);
      case StageActions.VICTORY:
        let basePoints = action.payload;
        return _.defaults({
          scene: 'victory',
          victoryPhrase: new VictoryPhraseBuilder(basePoints / 10).build()
        }, state);
      case StageActions.PLAY: {
        let [note, beat, tick] = action.payload;
        let playedPhrase = _.cloneDeep(state.playedPhrase).add(note, beat, tick);
        let goalPlayed = _.isEqual(state.goalPhrase, playedPhrase);
        return _.defaults({
          playedPhrase: playedPhrase,
          goalPlayed: goalPlayed
        }, state);
      }
      default: {
        return state;
      }
    }
  }
}

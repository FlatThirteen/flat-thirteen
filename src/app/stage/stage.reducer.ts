import * as _ from 'lodash';
import { Action } from '@ngrx/store';

import { StageActions } from './stage.actions';
import { PlayerActions } from '../player/player.actions';

export type StageScene = 'Demo' | 'Count' | 'Goal' | 'Play' | 'Victory';

export class StageState {
  readonly scene: StageScene;
  readonly nextScene: StageScene;
  readonly round: number;
  readonly active: boolean;
  readonly inactiveRounds: number;

  static reducer(state: StageState, action: Action): StageState {
    switch (action.type) {
      case StageActions.INIT:
      case StageActions.RESET: {
        return {
          scene: 'Demo', 
          nextScene: 'Count',
          round: 0,
          active: false, 
          inactiveRounds: 0
        } as StageState;
      }
      case StageActions.NEXTROUND: {
        let playedGoal = action.payload;
        return StageState.nextRound(state, playedGoal);
      }
      case PlayerActions.SET:
      case PlayerActions.UNSET:
      case PlayerActions.PULSES: {
        return <StageState>_.defaultsDeep({
          active: true
        }, state);
      }
      default: {
        return state;
      }
    }
  }

  static nextRound(state: StageState, playedGoal: boolean) {
    let nextScene = state.nextScene;
    let active = state.active;
    let inactiveRounds = state.inactiveRounds;

    if (playedGoal) {
      nextScene = 'Victory';
    } else {
      if (active) {
        inactiveRounds = 0;
      } else if (inactiveRounds >= 3) {
        nextScene = 'Goal';
      }
    }

    let round = state.round;
    let scene = nextScene;
    active = false;
    switch(scene) {
      case 'Count':
      case 'Victory':
        nextScene = 'Goal';
        round = 0;
        break;
      case 'Goal':
        nextScene = 'Play';
        inactiveRounds = 0;
        break;
      case 'Play':
        round++;
        if (!active) {
          inactiveRounds++;
        } else {
          inactiveRounds = 0;
        }
    }

    return <StageState>_.defaultsDeep({
      scene: scene,
      nextScene: nextScene,
      round: round,
      active: active,
      inactiveRounds: inactiveRounds
    }, state);
  }
}
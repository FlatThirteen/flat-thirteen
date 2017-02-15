import * as _ from 'lodash';
import { Action } from '@ngrx/store';

import { StageActions } from './stage.actions';

export class StageState {
  static StateDemo = "Demo";
  static StateCount = "Count";
  static StateGoal = "Goal";
  static StatePlay = "Play";
  static StateVictory = "Victory";

  readonly _state: string;
  readonly _nextState: string;
  readonly _round: number;
  readonly _active: boolean;
  readonly _inactiveRounds: number;

  constructor(state: string, nextState: string, round: number, active: boolean, inactiveRounds: number) {
    this._state = state;
    this._nextState = nextState;
    this._round = 0;
    this._active = false;
    this._inactiveRounds = 0;
  }

  static reducer(state: StageState, action: Action): StageState {
    switch (action.type) {
      case StageActions.INIT: {
        return new StageState(StageState.StateCount, StageState.StateDemo, 0, false, 0);
      }
      case StageActions.RESET: {
        return <StageState>_.defaultsDeep({
            _state: StageState.StateCount,
            _nextState: StageState.StateDemo,
            _round: 0,
            _active: false,
            _inactiveRounds: 0
          }, state);
      }
      case StageActions.SETACTIVE: {
        return <StageState>_.defaultsDeep({
          _state: state._state,
          _nextState: state._nextState,
          _round: state._round,
          _active: true,
          _inactiveRounds: state._inactiveRounds
        }, state);
      }
      case StageActions.NEXTROUND: {
        let [playedGoal] = action.payload;
        return StageState.nextRound(state, playedGoal);
      }
      default: {
        return state;
      }
    }
  }

  static nextRound(stageState: StageState, playedGoal: boolean) {
    let nextState = stageState._nextState;
    let active = stageState._active;
    let inactiveRounds = stageState._inactiveRounds;

    if (playedGoal) {
      nextState = StageState.StateVictory;
    } else {
      if (active) {
        inactiveRounds = 0;
      } else if (inactiveRounds >= 3) {
        nextState = StageState.StateGoal;
      }
    }

    let round = stageState._round;
    let state = nextState;
    active = false;
    switch(state) {
      case StageState.StateCount:
      case StageState.StateVictory:
        nextState = StageState.StateGoal;
        round = 0;
        break;
      case StageState.StateGoal:
        nextState = StageState.StatePlay;
        inactiveRounds = 0;
        break;
      case StageState.StatePlay:
        round++;
        if (!active) {
          inactiveRounds++;
        } else {
          inactiveRounds = 0;
        }
    }

    return <StageState>_.defaultsDeep({
      _state: state,
      _nextState: nextState,
      _round: round,
      _active: active,
      _inactiveRounds: inactiveRounds
    }, stageState);
  }
}
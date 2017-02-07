import * as _ from 'lodash';

import { Action } from '@ngrx/store';

import { PlayerActions } from './player.actions';
import { Surface } from "../features/shared/surface.model";

export class PlayerState {
  readonly selected?: string;
  readonly beat?: number;
  readonly cursor: number;

  constructor(readonly data: _.Dictionary<Surface.Data>) {
    this.selected = null;
    this.beat = null;
    this.cursor = 0;
  }

  cursorAdvance(key: string) {
    return { cursor: Math.min(this.cursor + 1, this.data[key].pulses - 1) };
  }

  static reducer(state: PlayerState, action: Action): PlayerState {
    switch (action.type) {
      case PlayerActions.INIT: {
        return new PlayerState(action.payload);
      }
      case PlayerActions.SELECT: {
        let [key, surface] = action.payload;
        return <PlayerState>_.defaults({
          selected: key,
          beat: surface.get(key).beat,
          cursor: 0
        }, state);
      }
      case PlayerActions.UNSELECT: {
        if (!state.selected) {
          return state;
        } else {
          return _.defaults({ selected: null, beat: null }, state);
        }
      }
      case PlayerActions.SET: {
        let [key, surface] = action.payload;
        if (surface) {
          return <PlayerState>_.defaultsDeep({
            selected: key,
            beat: surface.get(key).beat,
            data: surface.set(key, state.data[key])
          }, state.cursorAdvance(key), state);
        } else {
          return state;
        }
      }
      case PlayerActions.UNSET: {
        let [key, surface] = action.payload;
        if (surface) {
          return <PlayerState>_.defaultsDeep({
            data: surface.unset(key, state.data[key])
          }, state.cursorAdvance(key), state);
        } else {
          return state;
        }
      }
      case PlayerActions.PULSES: {
        let [key, pulses, surface] = action.payload;
        if (surface) {
          let newData = { data: surface.setPulses(state.selected, pulses, state.data[key]) };
          return <PlayerState>_.defaultsDeep(newData, state);
        } else {
          return state;
        }
      }
      default: {
        return state;
      }
    }
  }
}

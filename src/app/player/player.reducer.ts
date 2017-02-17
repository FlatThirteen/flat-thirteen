import * as _ from 'lodash';

import { Action } from '@ngrx/store';

import { Grid } from "../surface/grid/grid.model";
import { PlayerActions } from './player.actions';
import { Surface } from "../surface/surface.model";

export class PlayerState {
  readonly selected?: string;
  readonly beat?: number;
  readonly cursor: number;

  constructor(readonly data: _.Dictionary<Surface.Data[]>) {
    this.selected = null;
    this.beat = null;
    this.cursor = 0;
  }

  static reducer(state: PlayerState, action: Action): PlayerState {
    switch (action.type) {
      case PlayerActions.INIT: {
        return new PlayerState(action.payload);
      }
      case PlayerActions.SELECT: {
        let [surface, key] = action.payload;
        if (surface instanceof Grid) {
          let beat = surface.infoFor(key).beat;
          return <PlayerState>_.defaults({
            selected: key,
            beat: beat,
            cursor: state.beat === beat ? state.cursor : 0
          }, state);
        } else {
          return state;
        }
      }
      case PlayerActions.UNSELECT: {
        if (!state.selected) {
          return state;
        } else {
          return _.defaults({ selected: null, beat: null }, state);
        }
      }
      case PlayerActions.SET: {
        let [surface, key, cursor] = action.payload;
        if (surface instanceof Grid) {
          let [info, data] = surface.infoDataFor(key, state.data);
          return <PlayerState>_.defaultsDeep({
            selected: key,
            beat: info.beat,
            cursor: surface.advanceCursor(data, cursor),
            data: surface.set(info, data, cursor),
          }, state);
        } else {
          return state;
        }
      }
      case PlayerActions.UNSET: {
        let [surface, key, cursor] = action.payload;
        if (surface instanceof Grid) {
          let [info, data] = surface.infoDataFor(key, state.data);
          return <PlayerState>_.defaultsDeep({
            cursor: surface.advanceCursor(data, cursor),
            data: surface.unset(info, data, cursor)
          }, state);
        } else {
          return state;
        }
      }
      case PlayerActions.PULSES: {
        let [surface, key, pulses] = action.payload;
        if (surface instanceof Grid) {
          let [info, data] = surface.infoDataFor(key, state.data);
          return <PlayerState>_.defaultsDeep({
            cursor: 0,
            data: surface.setPulses(info, pulses, data)
          }, state);
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

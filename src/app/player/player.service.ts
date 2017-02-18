import * as _ from 'lodash';

import { Injectable } from '@angular/core';
import { Store } from "@ngrx/store";

import { createSelector } from 'reselect';
import 'rxjs/add/operator/distinctUntilChanged';

import { AppState } from "../reducers/index";
import { Grid, GridData } from "../features/a1/grid/grid.model";
import { Observable } from "rxjs";
import { PlayerActions } from "./player.actions";
import { Surface } from "../surface/surface.model";
import { SurfaceService } from "../surface/surface.service";
import { Note } from "../sound/sound";

@Injectable()
export class PlayerService {
  static getPlayer = (state: AppState) => state.player;
  static getData = createSelector(PlayerService.getPlayer, player => player && player.data);
  static getSelected = createSelector(PlayerService.getPlayer, player => player && player.selected);
  static getBeat = createSelector(PlayerService.getPlayer, player => player && player.beat);
  static getCursor = createSelector(PlayerService.getPlayer, player => player && player.cursor);

  private data$: Observable<_.Dictionary<Surface.Data[]>>;
  private selected$: Observable<string>;
  private beat$: Observable<number>;
  private cursor$: Observable<number>;

  private _data: _.Dictionary<Surface.Data[]>;
  private _selected: string;
  private _beat: number;
  private _cursor: number;

  constructor(private store: Store<AppState>, private player: PlayerActions,
              private surface: SurfaceService) {
    this.data$ = this.store.select(PlayerService.getData);
    this.selected$ = this.store.select(PlayerService.getSelected);
    this.beat$ = this.store.select(PlayerService.getBeat);
    this.cursor$ = this.store.select(PlayerService.getCursor);

    this.data$.subscribe(data => { this._data = data });
    this.selected$.subscribe(selected => { this._selected = selected });
    this.beat$.subscribe(beat => { this._beat = beat });
    this.cursor$.subscribe(cursor => { this._cursor = cursor });
  }

  get selected() {
    return this._selected;
  }

  get cursor() {
    return this._cursor;
  }

  init(surfaces: Surface[]) {
    this.store.dispatch(this.player.init(surfaces));
  }

  select(key: string) {
    this.store.dispatch(this.player.select(key));
  }

  unselect() {
    this.store.dispatch(this.player.unselect());
  }

  set(key: string, cursor: number) {
    let surface = this.surface.forKey(key);
    let pulses = 1;
    if (surface instanceof Grid) {
      let [info, data] = surface.infoDataFor(key, this._data);
      if (info.beat !== this._beat) {
        // Reset cursor ahead of action dispatch so player effect gets it
        cursor = 0;
      }
      pulses = data.pulses;
    }
    this.store.dispatch(this.player.set(key, cursor, pulses));
  }

  unset(key: string, cursor: number) {
    this.store.dispatch(this.player.unset(key, cursor));
  }

  pulses(key: string, pulses?: number) {
    if (pulses) {
      this.store.dispatch(this.player.pulses(key, pulses));
    } else {
      let surface = this.surface.forKey(key);
      if (surface instanceof Grid) {
        let data = surface.infoDataFor(key, this._data)[1];
        return data.pulses;
      }
    }
  }

  isSelected(beat: number) {
    return this._beat === beat;
  }

  isPulses(beat: number, pulses: number) {
    let surface = this.surface.forKey(this._selected);
    if (surface instanceof Grid) {
      let [info, data] = surface.infoDataFor(this._selected, this._data);
      return info.beat === beat && data.pulses === pulses;
    }
  }

  value(key: string, cursor: number = 0): boolean {
    let surface = this.surface.forKey(key);
    if (surface instanceof Grid) {
      let [info, data] = surface.infoDataFor(key, this._data);
      return data.notes[cursor] === info.sound;
    }
  }

  values(key: string): boolean[] {
    let surface = this.surface.forKey(key);
    if (surface instanceof Grid) {
      let [info, data] = surface.infoDataFor(key, this._data);
      return _.map(data.notes, (sound) => sound === info.sound);
    }
  }

  notesAt(beat: number, tick: number): Note[] {
    return _.map(_.values(this._data), (data: GridData[]) => data[beat].noteAt(tick));
  }

  toggle(key: string, cursor?: number) {
    if (this.value(key, cursor)) {
      this.unset(key, cursor);
    } else {
      this.set(key, cursor);
    }
  }
}

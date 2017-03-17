import * as _ from 'lodash';

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { createSelector } from 'reselect';

import { AppState } from '../app.reducer';
import { Grid as A1Grid } from '../../main/a1/grid/grid.model';
import { Grid } from '../../a2/main/grid/grid.model';
import { LessonService } from '../lesson/lesson.service';
import { Observable } from 'rxjs';
import { PlayerActions } from './player.actions';
import { Surface } from '../surface/surface.model';
import { Note } from '../sound/sound';

@Injectable()
export class PlayerService {
  static getPlayer = (state: AppState) => state.player;
  static getData = createSelector(PlayerService.getPlayer, player => player && player.data);
  static getSelected = createSelector(PlayerService.getPlayer, player => player && player.selected);
  static getBeat = createSelector(PlayerService.getPlayer, player => player && player.beat);
  static getCursor = createSelector(PlayerService.getPlayer, player => player && player.cursor);
  static getTouched = createSelector(PlayerService.getPlayer, player => player && player.touched);

  readonly data$: Observable<_.Dictionary<Surface.Data[]>>;
  readonly selected$: Observable<string>;
  readonly beat$: Observable<number>;
  readonly cursor$: Observable<number>;
  readonly touched$: Observable<boolean>;

  private _data: _.Dictionary<Surface.Data[]>;
  private _selected: string;
  private _beat: number;
  private _cursor: number;

  constructor(private store: Store<AppState>, private player: PlayerActions,
              private lesson: LessonService) {
    this.data$ = this.store.select(PlayerService.getData);
    this.selected$ = this.store.select(PlayerService.getSelected);
    this.beat$ = this.store.select(PlayerService.getBeat);
    this.cursor$ = this.store.select(PlayerService.getCursor);
    this.touched$ = this.store.select(PlayerService.getTouched);

    this.data$.subscribe(data => { this._data = data; });
    this.selected$.subscribe(selected => { this._selected = selected; });
    this.beat$.subscribe(beat => { this._beat = beat; });
    this.cursor$.subscribe(cursor => { this._cursor = cursor; });
  }

  get selected() {
    return this._selected;
  }

  get beat() {
    return this._beat;
  }

  get cursor() {
    return this._cursor;
  }

  init() {
    this.store.dispatch(this.player.init());
  }

  select(key: string, cursor?: number) {
    if (key) {
      this.store.dispatch(this.player.select(key, cursor));
    }
  }

  unselect() {
    this.store.dispatch(this.player.unselect());
  }

  set(key: string, cursor: number) {
    let surface = this.lesson.surfaceFor(key);
    let pulses: number | number[] = 1;
    if (surface instanceof Grid) {
      // Send pulsesByBeat so player effect knows cursor is calculated from
      pulses = surface.pulsesByBeat;
    } else if (surface instanceof A1Grid) {
      let [info, data] = surface.infoDataFor(key, this._data);
      if (info.beat !== this._beat) {
        // Reset cursor ahead of action dispatch so player effect gets it
        cursor = 0;
      }
      pulses = data.pulses;
    }
    if (surface) {
      this.store.dispatch(this.player.set(key, cursor, pulses));
    }
    return !!surface;
  }

  unset(key: string, cursor: number) {
    this.store.dispatch(this.player.unset(key, cursor));
  }

  pulses(key: string, pulses?: number) {
    if (pulses) {
      this.store.dispatch(this.player.pulses(key, pulses));
    } else {
      let surface = this.lesson.surfaceFor(key);
      if (surface instanceof A1Grid) {
        let data = surface.infoDataFor(key, this._data)[1];
        return data.pulses;
      }
    }
  }

  isSelected(beat: number) {
    return this._beat === beat;
  }

  isPulses(beat: number, pulses: number) {
    let surface = this.lesson.surfaceFor(this._selected);
    if (surface instanceof A1Grid) {
      let [info, data] = surface.infoDataFor(this._selected, this._data);
      return info.beat === beat && data.pulses === pulses;
    }
  }

  value(key: string, cursor: number = 0): boolean {
    let surface = this.lesson.surfaceFor(key);
    if (surface instanceof Grid) {
      let [beat, pulse] = surface.beatPulseFor(cursor);
      let data = surface.dataFor(beat, this._data);
      return data.notes[pulse] === surface.soundByKey[key];
    } else if (surface instanceof A1Grid) {
      let [info, data] = surface.infoDataFor(key, this._data);
      return data.notes[cursor] === info.sound;
    }
  }

  notesAt(beat: number, tick: number): Note[] {
    return _.map(_.values(this._data), (data: Surface.Data[]) => data[beat].noteAt(tick));
  }

  toggle(key: string, cursor?: number) {
    if (this.value(key, cursor)) {
      this.unset(key, cursor);
    } else {
      this.set(key, cursor);
    }
  }
}

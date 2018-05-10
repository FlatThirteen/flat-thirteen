import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { createSelector } from 'reselect';

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Grid } from '../../a2/main/grid/grid.model';

import { AppState } from '../app.reducer';
import { LessonService } from '../lesson/lesson.service';
import { Note } from '../core/note.model';
import { Surface } from '../surface/surface.model';

import { Player } from './player.actions';

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
  private _noteCount: number;
  private _selected: string;
  private _beat: number;
  private _cursor: number;

  constructor(private store: Store<AppState>, private lesson: LessonService) {
    this.data$ = this.store.select(PlayerService.getData);
    this.selected$ = this.store.select(PlayerService.getSelected);
    this.beat$ = this.store.select(PlayerService.getBeat);
    this.cursor$ = this.store.select(PlayerService.getCursor);
    this.touched$ = this.store.select(PlayerService.getTouched);

    this.data$.subscribe(data => {
      this._data = data;
      this._noteCount = _.reduce(_.values(data), (sum, surfaceData: Surface.Data[]) =>
          sum + _.reduce(surfaceData, (beatSum, beatData: Surface.Data) =>
          beatSum + beatData.noteCount(), 0), 0);
    });
    this.selected$.subscribe(selected => { this._selected = selected; });
    this.beat$.subscribe(beat => { this._beat = beat; });
    this.cursor$.subscribe(cursor => { this._cursor = cursor; });
  }

  get noteCount() {
    return this._noteCount;
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
    this.store.dispatch(new Player.InitAction({ initialData: this.lesson.initialData }));
  }

  select(key: string, cursor?: number) {
    let surface = this.lesson.surfaceFor(key);
    if (surface) {
      this.store.dispatch(new Player.SelectAction({ key, surface, cursor }));
    }
  }

  unselect() {
    this.store.dispatch(new Player.UnselectAction());
  }

  set(key: string, cursor: number) {
    let surface = this.lesson.surfaceFor(key);
    if (surface) {
      this.store.dispatch(new Player.SetAction({ key, surface, cursor }));
    }
    return !!surface;
  }

  unset(key: string, cursor: number) {
    let surface = this.lesson.surfaceFor(key);
    if (surface) {
      this.store.dispatch(new Player.UnsetAction({ surface, cursor }));
    }
  }

  value(key: string, cursor: number = 0): boolean {
    let surface = this.lesson.surfaceFor(key);
    if (surface instanceof Grid) {
      let [beat, pulse] = surface.beatPulseFor(cursor);
      let data = surface.dataFor(beat, this._data);
      return data.notes[pulse] === surface.soundByKey[key];
    }
  }

  notesAt(beat: number, tick: number): Note[] {
    return _.filter(_.map(_.values(this._data),
        (data: Surface.Data[]) => data[beat].noteAt(tick)));
  }

  toggle(key: string, cursor?: number) {
    if (this.value(key, cursor)) {
      this.unset(key, cursor);
    } else {
      this.set(key, cursor);
    }
  }
}

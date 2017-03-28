import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { createSelector } from 'reselect';

import { AppState } from '../app.reducer';
import { EndCondition } from './lesson.reducer';
import { LessonActions } from './lesson.actions';
import { MonophonicMonotonePhraseBuilder } from '../phrase/phrase.model';
import { Rhythm } from '../core/rhythm.model';
import { SoundName } from '../sound/sound';
import { Surface } from '../surface/surface.model';

@Injectable()
export class LessonService {
  static getLesson = (state: AppState) => state.lesson;
  static getSurfaces = createSelector(LessonService.getLesson, lesson => lesson && lesson.surfaces);
  static getEnd = createSelector(LessonService.getLesson, lesson => lesson && lesson.end);
  static getStage = createSelector(LessonService.getLesson, lesson => lesson && lesson.stage);

  private surfaces$: Observable<Surface[]>;
  private end$: Observable<EndCondition>;
  private stage$: Observable<number>;

  private _surfaces: Surface[];
  private end: EndCondition;
  private _stage: number;

  private _soundNames: SoundName[];
  private _initialData: _.Dictionary<Surface.Data>;

  private _rhythm: Rhythm;
  private _minNotes: number;
  private _maxNotes: number;

  constructor(private store: Store<AppState>, private lesson: LessonActions) {
    this.surfaces$ = this.store.select(LessonService.getSurfaces);
    this.end$ = this.store.select(LessonService.getEnd);
    this.stage$ = this.store.select(LessonService.getStage);

    this.surfaces$.subscribe(surfaces => {
      this._surfaces = surfaces;
      this._soundNames = <SoundName[]>_.flatten(_.map(surfaces, 'soundNames'));
      this._initialData = _.reduce(surfaces, (result, surface) => {
        return _.set(result, surface.id, surface.initialData);
      }, {});
    });
    this.end$.subscribe(end => { this.end = end; });
    this.stage$.subscribe(stage => { this._stage = stage; });

    this._rhythm = new Rhythm([1, 1, 1, 1]);
    this._minNotes = 3;
    this._maxNotes = 16;
  }

  init(surfaces: Surface[], end: EndCondition) {
    this.store.dispatch(this.lesson.init(surfaces, end));
  }

  reset() {
    this.store.dispatch(this.lesson.reset());
  }

  advance(rounds: number) {
    this.store.dispatch(this.lesson.advance(rounds));
  }

  set rhythm(rhythm: Rhythm) {
    this._rhythm = rhythm;
  }

  set min(min: number) {
    if (min) {
      this._minNotes = _.clamp(min, 2, this._maxNotes);
    }
  }

  set max(max: number) {
    if (max) {
      this._maxNotes = _.clamp(max, this._minNotes, 16);
    }
  }

  get surfaces() {
    return this._surfaces;
  }

  get stage() {
    return this._stage;
  }

  get soundNames() {
    return this._soundNames;
  }

  get initialData() {
    return this._initialData;
  }

  get phraseBuilder() {
    if (this.end && this.end.stages && this.end.stages <= this._stage) {
      return null;
    }
    return new MonophonicMonotonePhraseBuilder(this._soundNames, this._rhythm,
        this._minNotes, this._maxNotes);
  }

  get pulsesByBeat() {
    return this._rhythm.pulsesByBeat;
  }

  get beatsPerMeasure() {
    return this.pulsesByBeat.length;
  }

  get supportedPulses() {
    return this._rhythm.supportedPulses;
  }

  surfaceFor(key: string): Surface {
    return key ? _.find(this._surfaces, (surface: Surface) => surface.listens(key)) : null;
  }
}

import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { createSelector } from 'reselect';

import { AppState } from '../../../common/app.reducer';
import { Rhythm } from '../../../common/core/rhythm.model';
import { SoundName } from '../../../common/core/note.model';
import { ConstantPhraseBuilder, MonophonicMonotonePhraseBuilder } from '../../../common/phrase/phrase.model';
import { Surface } from '../../../common/surface/surface.model';

import { Lesson } from './lesson.actions';
import { Plan } from './lesson.reducer';

@Injectable()
export class LessonService {
  static getLesson = (state: AppState) => state.a2.lesson;
  static getPlan = createSelector(LessonService.getLesson, lesson => lesson && lesson.plan);
  static getStage = createSelector(LessonService.getLesson, lesson => lesson && lesson.stage);

  private plan$: Observable<Plan>;
  private stage$: Observable<number>;

  private _plan : Plan;
  private _stage: number;

  private _soundNames: SoundName[];
  private _initialData: _.Dictionary<Surface.Data[]>;

  private _rhythm: Rhythm;
  private _minNotes: number;
  private _maxNotes: number;

  constructor(private store: Store<AppState>) {
    this.plan$ = this.store.select(LessonService.getPlan);
    this.stage$ = this.store.select(LessonService.getStage);

    this.plan$.subscribe(plan => {
      this._plan = plan;
      if (plan && plan.surfaces) {
        this._soundNames = <SoundName[]>_.flatten(_.map(plan.surfaces, 'soundNames'));
        this._initialData = _.reduce(plan.surfaces, (result, surface) => {
          return _.set(result, surface.id, surface.initialData);
        }, {});
      }
    });
    this.stage$.subscribe(stage => { this._stage = stage; });

    this._rhythm = new Rhythm([1, 1, 1, 1]);
    this._minNotes = 3;
    this._maxNotes = 16;
  }

  init(plan: Plan) {
    this.store.dispatch(new Lesson.InitAction({ plan }));
  }

  reset() {
    this.store.dispatch(new Lesson.ResetAction());
  }

  advance(rounds: number) {
    this.store.dispatch(new Lesson.AdvanceAction({ rounds }));
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
    return this._plan.surfaces;
  }

  get stages() {
    return this._plan.stages;
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
    if (this._plan && this._plan.stages) {
      if (_.isNumber(this._plan.stages) && this._plan.stages <= this._stage) {
        return null;
      } else if (_.isArray(this._plan.stages)) {
        if (this._plan.stages[this._stage]) {
          return new ConstantPhraseBuilder(this._plan.stages[this._stage]);
        } else {
          return null;
        }
      }
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
    if (this._plan && this._plan.surfaces) {
      return key ? _.find(this._plan.surfaces, (surface: Surface) => surface.listens(key)) : null;
    }
  }
}

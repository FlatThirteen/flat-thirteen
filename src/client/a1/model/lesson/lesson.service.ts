import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { createSelector } from 'reselect';

import { AppState } from '../../../common/app.reducer';
import { SoundName } from '../../../common/core/note.model';
import { Surface } from '../../../common/surface/surface.model';

import { LessonActions } from './lesson.actions';
import { Plan } from './lesson.reducer';

@Injectable()
export class LessonService {
  static getLesson = (state: AppState) => state.a1.lesson;
  static getPlan = createSelector(LessonService.getLesson, lesson => lesson && lesson.plan);
  static getStage = createSelector(LessonService.getLesson, lesson => lesson && lesson.stage);
  static getCompleted = createSelector(LessonService.getLesson, lesson => lesson && lesson.completed);

  private plan$: Observable<Plan>;
  private stage$: Observable<number>;
  private completed$: Observable<boolean[]>;

  private _plan: Plan;
  private _stage: number;
  private _completed: boolean[];

  private _soundNames: SoundName[];
  private _initialData: _.Dictionary<Surface.Data>;
  private _weenieStage: number;

  constructor(private store: Store<AppState>, private lesson: LessonActions) {
    this.plan$ = this.store.select(LessonService.getPlan);
    this.stage$ = this.store.select(LessonService.getStage);
    this.completed$ = this.store.select(LessonService.getCompleted);

    this.plan$.subscribe(plan => {
      this._plan = plan;
      if (plan && plan.surfaces) {
        this._soundNames = <SoundName[]>_.flatten(_.map(plan.surfaces, 'soundNames'));
        this._initialData = _.reduce(plan.surfaces, (result, surface) => {
          return _.set(result, surface.id, surface.initialData);
        }, {});
        this._weenieStage = 0;
      }
    });
    this.stage$.subscribe(stage => { this._stage = stage; });
    this.completed$.subscribe(completed => {
      this._completed = completed;
      if (this._completed) {
        while (this._completed[this._weenieStage]) {
          this._weenieStage++;
        }
      }
    });
  }

  init(plan: Plan) {
    this.store.dispatch(this.lesson.init(plan));
  }

  reset() {
    this.store.dispatch(this.lesson.reset());
  }

  set stage(stage: number) {
    this.store.dispatch(this.lesson.stage(stage));
  }

  complete(rounds: number, stage?: number) {
    this.store.dispatch(this.lesson.complete(rounds, stage));
  }

  get surfaces() {
    return this._plan && this._plan.surfaces;
  }

  get stages() {
    return this._plan && this._plan.stages;
  }

  get numberOfStages() {
    return this._plan ? this._plan.numberOfStages : 0;
  }

  get stage() {
    return this._stage;
  }

  get weenieStage() {
    return this._weenieStage;
  }

  completed(stage: number) {
    return this._completed && this._completed[stage];
  }

  get soundNames() {
    return this._soundNames;
  }

  get initialData() {
    return this._initialData;
  }

  surfaceFor(key: string): Surface {
    if (this._plan && this._plan.surfaces) {
      return key ? _.find(this._plan.surfaces, (surface: Surface) => surface.listens(key)) : null;
    }
  }
}

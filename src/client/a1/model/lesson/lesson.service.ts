import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import { Observable } from 'rxjs';
import { createSelector } from 'reselect';

import { AppState } from '../../../common/app.reducer';
import { SoundName } from '../../../common/core/note.model';
import { Surface } from '../../../common/surface/surface.model';

import { Lesson } from './lesson.actions';
import { Plan, Result } from './lesson.reducer';

@Injectable()
export class LessonService {
  static getLesson = (state: AppState) => state.a1.lesson;
  static getPlan = createSelector(LessonService.getLesson, lesson => lesson && lesson.plan);
  static getStage = createSelector(LessonService.getLesson, lesson => lesson && lesson.stage);
  static getResult = createSelector(LessonService.getLesson, lesson => lesson && lesson.result);

  private plan$: Observable<Plan>;
  private stage$: Observable<number>;
  private result$: Observable<Result>;

  private _plan: Plan;
  private _stage: number;
  private _result: Result;

  private _soundNames: SoundName[];
  private _initialData: _.Dictionary<Surface.Data[]>;
  private _weenieStage: number;

  constructor(private store: Store<AppState>) {
    this.plan$ = this.store.select(LessonService.getPlan);
    this.stage$ = this.store.select(LessonService.getStage);
    this.result$ = this.store.select(LessonService.getResult);

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
    this.result$.subscribe(result => {
      this._result = result;
      if (this._result && this._result.points) {
        while (this._result.points[this._weenieStage]) {
          this._weenieStage++;
        }
      }
    });
  }

  init(plan: Plan) {
    this.store.dispatch(new Lesson.InitAction({ plan }));
  }

  reset() {
    this.store.dispatch(new Lesson.ResetAction());
  }

  set stage(stage: number) {
    this.store.dispatch(new Lesson.StageAction({ stage }));
  }

  complete(rounds: number, stage: number, points: number) {
    this.store.dispatch(new Lesson.CompleteAction({ rounds, stage, points }));
  }

  get surfaces() {
    return this._plan && this._plan.surfaces;
  }

  get stages() {
    return this._plan && !this.waitingForNext ? this._plan.stages : [];
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

  get result() {
    return this._result;
  }

  pointsFor(stage: number) {
    return this._result && this._result.points && this._result.points[stage];
  }

  get soundNames() {
    return this._soundNames;
  }

  get initialData() {
    return this._initialData;
  }

  get inStage() {
    return this._stage !== undefined;
  }

  get waitingForNext() {
    return this.weenieStage === this.numberOfStages || !this._plan;
  }

  surfaceFor(key: string): Surface {
    if (this._plan && this._plan.surfaces) {
      return key ? _.find(this._plan.surfaces, (surface: Surface) => surface.listens(key)) : null;
    }
  }
}

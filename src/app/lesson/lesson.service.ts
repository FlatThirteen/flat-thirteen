import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { Store } from "@ngrx/store";

import { Observable } from "rxjs";
import { createSelector } from 'reselect';

import { AppState } from "../app.reducer";
import { EndCondition } from "./lesson.reducer";
import { LessonActions } from "./lesson.actions";
import { MonophonicMonotonePhraseBuilder } from "../phrase/phrase.model";
import { Rhythm } from "../core/rhythm.model";
import { SoundName } from "../sound/sound";
import { Surface } from "../surface/surface.model";

@Injectable()
export class LessonService {
  static getLesson = (state: AppState) => state.lesson;
  static getSurfaces = createSelector(LessonService.getLesson, lesson => lesson && lesson.surfaces);
  static getEnd = createSelector(LessonService.getLesson, lesson => lesson && lesson.end);
  static getStages = createSelector(LessonService.getLesson, lesson => lesson && lesson.stages);

  private surfaces$: Observable<Surface[]>;
  private end$: Observable<EndCondition>;
  private stages$: Observable<number>;

  private surfaces_: Surface[];
  private end: EndCondition;
  private stages: number;

  private soundNames_: SoundName[];
  private initialData_: _.Dictionary<Surface.Data>;

  private rhythm_: Rhythm;
  private minNotes_: number;
  private maxNotes_: number;

  constructor(private store: Store<AppState>, private lesson: LessonActions) {
    this.surfaces$ = this.store.select(LessonService.getSurfaces);
    this.end$ = this.store.select(LessonService.getEnd);
    this.stages$ = this.store.select(LessonService.getStages);

    this.surfaces$.subscribe(surfaces => {
      this.surfaces_ = surfaces;
      this.soundNames_ = <SoundName[]>_.flatten(_.map(surfaces, 'soundNames'));
      this.initialData_ = _.reduce(surfaces, (result, surface) => {
        return _.set(result, surface.id, surface.initialData);
      }, {});
    });
    this.end$.subscribe(end => { this.end = end });
    this.stages$.subscribe(stages => { this.stages = stages});

    this.rhythm_ = new Rhythm([[1, 0], [0.9, 0], 0.9, [0.9, 0, 0, 0]]);
    this.minNotes_ = 3;
    this.maxNotes_ = 7;
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

  get surfaces() {
    return this.surfaces_;
  }

  get soundNames() {
    return this.soundNames_;
  }

  get initialData() {
    return this.initialData_;
  }

  get phraseBuilder() {
    if (this.end && this.end.stages && this.end.stages <= this.stages) {
      return null;
    }
    return new MonophonicMonotonePhraseBuilder(this.soundNames_, this.rhythm_,
        this.minNotes_, this.maxNotes_);
  }

  get pulsesByBeat() {
    return this.rhythm_.pulsesByBeat;
  }

  get beatsPerMeasure() {
    return this.pulsesByBeat.length
  }

  get supportedPulses() {
    return this.rhythm_.supportedPulses;
  }

  surfaceFor(key: string): Surface {
    return key ? _.find(this.surfaces_, (surface: Surface) => surface.listens(key)) : null;
  }
}

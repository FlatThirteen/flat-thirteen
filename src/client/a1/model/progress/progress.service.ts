import * as _ from 'lodash';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { createSelector } from 'reselect';

import { AppState } from '../../../common/app.reducer';
import { Grid } from '../../main/grid/grid.model';
import { LessonService } from '../lesson/lesson.service';
import { MonophonicMonotonePhraseBuilder, Phrase } from '../../../common/phrase/phrase.model';
import { TransportService } from '../../../common/core/transport.service';

import { ProgressActions } from './progress.actions';
import { Settings } from './progress.reducer';

const numberOfStages = 4;

@Injectable()
export class ProgressService {
  static getProgress = (state: AppState) => state.a1.progress;
  static getSettings = createSelector(ProgressService.getProgress, progress => progress && progress.settings);
  static getLessonNumber = createSelector(ProgressService.getProgress, progress => progress && progress.lessonNumber);

  private settings$: Observable<Settings>;
  private lessonNumber$: Observable<number>;

  private _settings: Settings;
  private _lessonNumber: number;

  constructor(private store: Store<AppState>, private progress: ProgressActions,
              private lesson: LessonService, private transport: TransportService) {
    this.settings$ = this.store.select(ProgressService.getSettings);
    this.lessonNumber$ = this.store.select(ProgressService.getLessonNumber);

    this.settings$.subscribe(settings => {
      this._settings = settings;
      if (this._settings) {
        transport.reset([this._settings.rhythm.pulsesByBeat.length]);
      }
    });

    this.lessonNumber$.subscribe(lessonNumber => {
      this._lessonNumber = lessonNumber;
      if (lessonNumber === undefined || this._settings === undefined) {
        return;
      }
      if (!lessonNumber && this._settings.rhythm.isSimple()) {
        let grid = new Grid({a: 'kick'}, this._settings.rhythm.pulsesByBeat);
        this.lesson.init({
          surfaces: [grid],
          stages: [
            new Phrase('kick@0:000,1:000,2:000,3:000'),
            new Phrase('kick@0:000,1:000,2:000'),
            new Phrase('kick@0:000,2:000,3:000'),
            new Phrase('kick@0:000,1:000,3:000')
          ],
          numberOfStages: numberOfStages
        });
      } else {
        let grid = new Grid({q: 'snare', a: 'kick'}, this._settings.rhythm.pulsesByBeat);
        let phraseBuilder = new MonophonicMonotonePhraseBuilder(grid.soundNames,
          this._settings.rhythm, this._settings.minNotes, this._settings.maxNotes);
        this.lesson.init({
          surfaces: [grid],
          stages: _.times(numberOfStages, () => phraseBuilder.build()),
          numberOfStages: numberOfStages });
      }
    });
  }

  init(settings: Settings) {
    this.store.dispatch(this.progress.init(settings));
  }

  next() {
    this.store.dispatch(this.progress.next());
  }

  isEndGame() {
    return this._settings && !this._settings.rhythm.isSimple() || this._lessonNumber;
  }
}

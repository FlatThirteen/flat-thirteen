import * as _ from 'lodash';

import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { createSelector } from 'reselect';

import { AppState } from '../../../common/app.reducer';
import { MonophonicMonotonePhraseBuilder, Phrase } from '../../../common/phrase/phrase.model';
import { PowersService, PowerType, PowerUp, PowerUpType } from '../../../common/core/powers.service';
import { Rhythm } from '../../../common/core/rhythm.model';
import { TransportService } from '../../../common/core/transport.service';

import { Grid } from '../../main/grid/grid.model';

import { LessonService } from '../lesson/lesson.service';
import { Result } from '../lesson/lesson.reducer';

import { Progress } from './progress.actions';
import { Settings } from './progress.reducer';

const numberOfStages = 4;
const soundByKey = [
  ['q', 'snare'],
  ['a', 'kick']
];

function buildSoundByKey(level: number) {
  return _.fromPairs(_.slice(soundByKey, - (level + 1)));
}

@Injectable()
export class ProgressService {
  static getProgress = (state: AppState) => state.a1.progress;
  static getSettings = createSelector(ProgressService.getProgress, progress => progress && progress.settings);
  static getLessonNumber = createSelector(ProgressService.getProgress, progress => progress && progress.lessonNumber);
  static getResults = createSelector(ProgressService.getProgress, progress => progress && progress.results);
  static getPoints = createSelector(ProgressService.getProgress, progress => progress && progress.points);
  static getPowerUps = createSelector(ProgressService.getProgress, progress => progress && progress.powerUps);

  private settings$: Observable<Settings>;
  private lessonNumber$: Observable<number>;
  private results$: Observable<Result[]>;
  private points$: Observable<number>;
  private powerUps$: Observable<PowerUp[]>;

  private _settings: Settings;
  private _lessonNumber: number;
  private _results: Result[];
  private _points: number;
  private _powerUps: PowerUp[];
  private _powerLevels: _.Dictionary<number[]>;

  constructor(private store: Store<AppState>, private lesson: LessonService,
              private powers: PowersService, private transport: TransportService) {
    this.settings$ = this.store.select(ProgressService.getSettings);
    this.lessonNumber$ = this.store.select(ProgressService.getLessonNumber);
    this.results$ = this.store.select(ProgressService.getResults);
    this.points$ = this.store.select(ProgressService.getPoints);
    this.powerUps$ = this.store.select(ProgressService.getPowerUps);

    this.settings$.subscribe(settings => {
      this._settings = settings;
      if (this._settings) {
        this._powerLevels = _.mapValues(this._settings.powers.levels,
            (max) => max && _.range(max + 1));
      }
    });

    this.lessonNumber$.subscribe(lessonNumber => {
      this._lessonNumber = lessonNumber;
      if (lessonNumber === undefined || this._settings === undefined) {
        return;
      }
      let stripLevel = this.powers.level('strip');
      let rhythm = Rhythm.fromPulses(this.powers.pulses);
      transport.reset([rhythm.pulsesByBeat.length]);
      let grid = new Grid(buildSoundByKey(stripLevel), rhythm.pulsesByBeat);
      if (!lessonNumber && rhythm.isSimple() && !stripLevel) {
        this.lesson.init({
          surfaces: [grid],
          stages: [
            new Phrase('kick@00:000,01:000,02:000,03:000'),
            new Phrase('kick@00:000,01:000,02:000'),
            new Phrase('kick@00:000,02:000,03:000'),
            new Phrase('kick@00:000,01:000,03:000')
          ],
          numberOfStages: numberOfStages
        });
      } else {
        let phraseBuilder = new MonophonicMonotonePhraseBuilder(grid.soundNames,
          rhythm, this._settings.minNotes, this._settings.maxNotes);
        this.lesson.init({
          surfaces: [grid],
          stages: _.times(numberOfStages, () => phraseBuilder.build()),
          numberOfStages: numberOfStages
        });
      }
    });

    this.results$.subscribe(results => { this._results = results; });
    this.points$.subscribe(points => { this._points = points; });
    this.powerUps$.subscribe(powerUps => { this._powerUps = powerUps; });
  }

  init(settings: Settings) {
    this.store.dispatch(new Progress.InitAction({ settings }));
  }

  power(type: PowerUpType, beat: number): PowerType {
    this.store.dispatch(new Progress.PowerAction({ type, beat }));
    return <PowerType>(beat ? type + beat : type);
  }

  result(result: Result) {
    this.store.dispatch(new Progress.ResultAction({ result }));
  }

  next() {
    this.store.dispatch(new Progress.NextAction());
  }

  get results() {
    return this._results || [];
  }

  get points() {
    return this._points;
  }

  get powerUps(): PowerUp[] {
    return this._powerUps || [];
  }

  get powerLevels() {
    return this._powerLevels;
  }

  get allowedPowers() {
    return this._settings && this._settings.powers;
  }
}

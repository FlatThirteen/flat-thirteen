import * as _ from 'lodash';

import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { trigger, style, animate, state, transition, keyframes } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { PowersService, PowerType, PowerUp } from '../../common/core/powers.service';
import { SoundService } from '../../common/sound/sound.service';
import { Surface } from '../../common/surface/surface.model';
import { TransportService } from '../../common/core/transport.service';

import { LessonService } from '../model/lesson/lesson.service';
import { PlayerService } from '../model/player/player.service';
import { ProgressService } from '../model/progress/progress.service';
import { StageService } from '../model/stage/stage.service';

import { Grid } from './grid/grid.model';

let requestAnimationFrameId: number;

/**
 * This class represents the lazy loaded A1Component.
 */
@Component({
  moduleId: module.id,
  selector: 'a1-main',
  templateUrl: 'a1-main.component.pug',
  styleUrls: ['a1-main.component.styl'],
  animations: [
    trigger('goal', [
      state('goal, goal-count', style({ transform: 'translateY(-50vh) scale(0.1, 0.5)' })),
      state('count-playback, goal-playback', style({ transform: 'scale(0)'})),
      state('playback, playback-count', style({ transform: 'rotate(45deg) scale(0)' })),
      state('victory', style({ opacity: 0 })),
      transition('standby => goal, standby => goal-count', [
        animate(250, keyframes([
          style({ transform: 'translateY(2vh) scale(1.2, 0.6)', offset: 0.2 }),
          style({ transform: 'translateY(0vh) scale(0.5, 1.2)', offset: 0.4 }),
          style({ transform: 'translateY(-50vh) scale(0.5, 1)', offset: 1 })
        ]))
      ]),
      transition('count-goal => goal, count-goal => goal-count', [
        animate(250, keyframes([
          style({ transform: 'translateX(-1vw) rotate(-15deg)', offset: 0.2 }),
          style({ transform: 'translateX(3vw) rotate(180deg)', offset: 1 })
        ]))
      ]),
      transition('goal-count => count-goal', [
        style({ transform: 'translateX(3vw) rotate(180deg)'}),
        animate(250, keyframes([
          style({ transform: 'translateX(3vw) rotate(180deg)', offset: 0 }),
          style({ transform: 'translateX(-1vw) rotate(-15deg)', offset: 0.8 }),
          style({ transform: 'translateX(0) rotate(0)', offset: 1 })
        ]))
      ]),
      transition('goal => standby, goal-count => standby', [
        animate(250, keyframes([
          style({ transform: 'translateY(-50vh) scale(0.5, 1)', offset: 0}),
          style({ transform: 'translateY(0vh) scale(0.5, 1.2)', offset: .6 }),
          style({ transform: 'translateY(2vh) scale(1.2, 0.6)', offset: .8 }),
          style({ transform: 'translateY(0) scale(1)', offset: 1 })
        ]))
      ]),
      transition('standby => playback, standby => playback-count, standby => count-playback', [
        animate(250, keyframes([
          style({ transform: 'rotate(0) scale(1.2)', offset: 0.2 }),
          style({ transform: 'rotate(-10deg) scale(1.2)', offset: 0.5 }),
          style({ transform: 'rotate(45deg) scale(0)', offset: 1 })
        ]))
      ]),
      transition('playback => standby, playback-count => standby', [
        animate(250, keyframes([
          style({ transform: 'rotate(90deg) scale(0.8)', offset: 0.5 }),
          style({ transform: 'rotate(-10deg) scale(1.2)', offset: 0.8 }),
          style({ transform: 'rotate(0) scale(1)', offset: 1 })
        ]))
      ])
    ]),
    trigger('play', [
      state('goal, goal-count', style({ transform: 'scale(0)' })),
      state('playback, playback-count', style({
        opacity: 0,
        transform: 'translateX(5vw) scale(0, 2)'
      })),
      state('victory', style({ opacity: 0 })),
      transition('* => goal', [
        animate(250, keyframes([
          style({ transform: 'rotate(0) scale(1.2)', offset: 0.1 }),
          style({ transform: 'rotate(-10deg) scale(1.2)', offset: 0.5 }),
          style({ transform: 'rotate(90deg) scale(0)', offset: 1 })
        ]))
      ]),
      transition('goal => standby, goal-count => standby', [
        animate(250, keyframes([
          style({ transform: 'rotate(45deg) scale(0.3)', offset: 0.5 }),
          style({ transform: 'rotate(-10deg) scale(1.2)', offset: 0.8 }),
          style({ transform: 'rotate(0) scale(1)', offset: 1 })
        ]))
      ]),
      transition('* => playback, * => playback-count', [
        animate(250, keyframes([
          style({ opacity: 1, transform: 'translateX(0) scale(1)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(-1vw) scale(0.8, 1.1)', offset: 0.2 }),
          style({ opacity: 1, transform: 'translateX(-1vw) scale(0.6, 1.2)', offset: 0.5 }),
          style({ opacity: 0.5, transform: 'translateX(3vw) scale(1.5, 0.1)', offset: 0.9 }),
          style({ opacity: 0, transform: 'translateX(3vw) scale(0, 0)', offset: 1 })
        ]))
      ]),
      transition('playback => standby, playback-count => standby', [
        animate(250, keyframes([
          style({ opacity: 0, transform: 'translateX(3vw) scale(0, 0)', offset: 0 }),
          style({ opacity: 0.5, transform: 'translateX(3vw) scale(1.5, 0.1)', offset: 0.1 }),
          style({ opacity: 1, transform: 'translateX(-1vw) scale(0.6, 1.2)', offset: 0.6 }),
          style({ opacity: 1, transform: 'translateX(-1vw) scale(0.8, 1.1)', offset: 0.8 }),
          style({ opacity: 1, transform: 'translateX(0) scale(1)', offset: 1 })
        ]))
      ])
    ]),
    trigger('repeat', [
      state('standby, playback, victory', style({ transform: 'scale(0)' })),
      state('goal, count', style({ transform: 'scale(1)'})),
      transition('goal => standby, count => standby', [
        animate(250, keyframes([
          style({ transform: 'scale(1)', offset: 0 }),
          style({ transform: 'scale(1.1)', offset: 0.2 }),
          style({ transform: 'scale(0)', offset: 1 }),
        ]))
      ]),
      transition('standby => count', [
        animate(250, keyframes([
          style({ transform: 'scale(0)', offset: 0 }),
          style({ transform: 'scale(1.1)', offset: 0.8 }),
          style({ transform: 'scale(1)', offset: 1 }),
        ]))
      ]),
      transition('count => goal', [
        animate(125, keyframes([
          style({ transform: 'translateX(0)', offset: 0 }),
          style({ transform: 'translateX(0.5vw)', offset: 0.3 }),
          style({ transform: 'translateX(-1vw)', offset: 0.6 }),
          style({ transform: 'translateX(0)', offset: 1 })
        ]))
      ]),
      transition('goal => playback, count => playback', [
        animate(250, keyframes([
          style({ opacity: 1, transform: 'translateX(0)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(1vw)', offset: 0.2 }),
          style({ opacity: 0, transform: 'translateX(-3vw)', offset: 1 })
        ]))
      ])
    ]),
    trigger('notes', [
      transition('* => *', [
        animate(250, keyframes([
          style({ transform: 'scale(1)', offset: 0 }),
          style({ transform: 'scale(0.8, 1.1)', offset: 0.2 }),
          style({ transform: 'scale(1.2, 0.8)', offset: 0.6 }),
          style({ transform: 'scale(1)', offset: 1 }),
        ]))
      ])
    ]),
    trigger('next', [
      transition(':enter', [
        style({ height: 0, margin: 0, opacity: 0 }),
        animate('250ms 500ms', style({ height: '*', margin: '*', opacity: 1 }))
      ]),
      transition(':leave', [
        style({ position: 'absolute', left: 0 }),
        animate(500, style({ opacity: 0 }))
      ])
    ]),
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(250, style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate(500, style({ opacity: 0, transform: 'scale(2)' }))
      ])
    ]),
    trigger('slideTop', [
      transition(':enter', [
        style({ transform: 'translateY(-30vh)' }),
        animate(500, style({ transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate(500, style({ transform: 'translateY(-30vh)' }))
      ])
    ]),
    trigger('slideBottom', [
      transition(':enter', [
        style({ transform: 'translateY(30vh)' }),
        animate(500, style({ transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate(500, style({ transform: 'translateY(30vh)' }))
      ])
    ]),
    trigger('surface', [
      transition('* => *', [
        animate(125, keyframes([
          style({ transform: 'translateX(0)', opacity: 1, offset: 0 }),
          style({ transform: 'translateX(-30vw)', opacity: 0, offset: 0.29 }),
          style({ transform: 'translateX(30vw)', opacity: 0, offset: 0.3 }),
          style({ transform: 'translateX(0)', opacity: 1, offset: 1 })
        ]))
      ])
    ]),
    trigger('powerUp', [
      transition(':enter', [
        animate(500, keyframes([
          style({ transform: 'scale(0)', opacity: 0, offset: 0 }),
          style({ transform: 'scale(1.1)', opacity: 1, offset: 0.8 }),
          style({ transform: 'scale(1)', opacity: 1, offset: 1 }),
        ]))
      ]),
      transition(':leave', [
        animate(250, keyframes([
          style({ transform: 'translateY(0)', opacity: 1, offset: 0 }),
          style({ transform: 'translateY(-10px)', opacity: 1, offset: 0.5 }),
          style({ transform: 'translateY(30vh)', opacity: 0, offset: 1 })
        ]))
      ])
    ]),
    trigger('settingOption', [
      state('hidden', style({
        overflow: 'hidden',
        height: 0,
        borderTopWidth: 0,
        borderBottomWidth: 0,
        paddingTop: 0,
        paddingBottom: 0
      })),
      transition('hidden => show', [
        animate(250)
      ]),
      transition('show => hidden', [
        animate(125)
      ])
    ])
  ]
})
export class A1MainComponent implements OnInit, OnDestroy {
  public showBouncingBall$: Observable<boolean>;
  public counter$: Observable<number>;
  public showSetting: PowerType;
  public changed: boolean = false;
  private _isGoalWeenie: boolean = false;

  private subscriptions: Subscription[];

  constructor(public route: ActivatedRoute, public transport: TransportService,
              public player: PlayerService, public stage: StageService,
              public lesson: LessonService, public powers: PowersService,
              public progress: ProgressService, public sound: SoundService) {
    this.showBouncingBall$ = combineLatest(transport.paused$, transport.lastBeat$).map(
      ([paused, lastBeat]) => !paused && (lastBeat ? stage.isCountGoal : stage.isGoal));
    this.counter$ = combineLatest(transport.paused$, transport.pulse$).map(
      ([paused, pulse]) => transport.started && stage.isCountGoal && pulse.beat + 1);
  }

  /**
   * Starts up the requestAnimationFrame loop so that the browser redraws the
   * UI as often as it can for a smooth refresh rate.
   */
  ngOnInit() {
    this.subscriptions = [
      this.player.noteCount$.subscribe((noteCount) => {
        if (noteCount && noteCount === this.stage.goalNotes && !this._isGoalWeenie) {
          if (this.stage.isStandby) {
            setTimeout(() => { // Start after note has a chance to play sound.
              this.stage.count('playback');
              this.transport.start();
            }, 50);
          } else {
            this.stage.next('playback');
          }
        } else if (this.stage.isCountPlay) {
          if (this.powers.autoLoop) {
            this.stage.next('goal');
          } else {
            this.onStandby();
          }
        }
        if (noteCount > this.stage.goalNotes) {
          this.sound.playSequence('cowbell', ['E5', 'F4'], '32n');
        }
        this.changed = true;
      })
    ];
    this.powers.init(this.route.snapshot.queryParams);
    this.progress.init({
      minNotes: _.parseInt(this.route.snapshot.queryParams['min']) || 3,
      maxNotes: _.parseInt(this.route.snapshot.queryParams['max']) || 16,
      powers: this.powers.current()
    });
    if (!this.progress.allowedPowers.any) {
      // Don't show initial next button if there are no powers.
      this.progress.next();
    }
    this.transport.setOnTop((first) => this.onTop(first));
    this.transport.setOnPulse((time, beat, tick) => this.stage.pulse(time, beat, tick));

    function draw() {
      requestAnimationFrameId = requestAnimationFrame(draw);
    }
    draw();
  }

  ngOnDestroy() {
    _.invokeMap(this.subscriptions, 'unsubscribe');
    window.cancelAnimationFrame(requestAnimationFrameId);
    this.transport.stop(true);
  }

  onTop(first) {
    if (!first) {
      if (this.stage.isVictory) {
        if (!this.powers.autoNext || !this.powers.autoGoal) {
          this.transport.stop();
        }
        this.lesson.complete(this.stage.round, this.lesson.stage, this.stage.basePoints);
        this.onStage(this.powers.autoNext ? this.lesson.weenieStage : undefined);
        if (this.lesson.waitingForNext) {
          this.progress.result(this.lesson.result);
        }
      } else if (this.stage.isPlayback && this.stage.goalPlayed) {
        this.stage.victory();
      } else if (this.stage.nextScene === 'goal') {
        this.stage.goal(this._isGoalWeenie &&
            this.player.noteCount === this.stage.goalNotes ? 'playback' :
            this.powers.autoLoop ? 'count' : 'standby', this._isGoalWeenie ? 0 : 2);
        this._isGoalWeenie = false;
      } else if (this.stage.nextScene === 'playback') {
        this.stage.playback(this.powers.autoLoop ? 'count' : 'standby');
      } else {
        if (this.stage.isPlayback) {
          this.stage.wrong(10);
          this.playMinusSequence();
        }
        if (this.stage.nextScene === 'count') {
          this.stage.count('goal');
        } else {
          this.onStandby();
        }
      }
    }
    this.changed = false;
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') { // Enter: Weenie if possible
      if (this.lesson.waitingForNext) {
        if (this.progress.powerUps.length) {
          this.onPower(this.progress.powerUps[0]);
        } else {
          this.onNext();
        }
      } else if (!this.lesson.inStage) {
        this.onStage(this.lesson.weenieStage);
      } else if (this.isGoalWeenie()) {
        this.onGoal();
      } else if (this.isPlaybackWeenie()) {
        this.onPlayback();
      } else if (this.stage.isCount) {
        this.onStandby();
      }
    } else if (event.key === 'Escape') { // Esc: Unselect
      this.player.unselect();
    } else if (event.key === ' ') { // Space: Unset
      this.player.unset(this.player.selected, this.player.cursor);
      this.player.select(this.player.selected, this.player.cursor + 1);
    } else if (event.key === 'Backspace') {
      this.player.unset(this.player.selected, this.player.cursor - 1);
    } else if (event.key === 'ArrowLeft') { // Left: Select previous
      this.player.select(this.player.selected, this.player.cursor - 1);
    } else if (event.key === 'ArrowRight') { // Right: Select next
      this.player.select(this.player.selected, this.player.cursor + 1);
    } else if (this.lesson.inStage && !this.transport.starting) { // Key: Set, disallow while starting
      if (this.player.set(event.key, this.player.cursor)) {
        this.player.select(this.player.selected, this.player.cursor + 1);
      }
    }
    return false;
  }

  @HostListener('mousedown')
  handleBackgroundMouseDown() {
    if (this.showSetting) {
      this.sound.playSequence('cowbell', ['E7'], '16n');
    }
    this.showSetting = null;
  }

  onSetting(powerType: PowerType, level: number) {
    if (this.showSetting === powerType) {
      this.powers.set(powerType, level);
      this.showSetting = null;
    } else {
      this.sound.playSequence('cowbell', ['E7'], '16n');
      this.showSetting = powerType;
    }
  }

  onStage(stage?: number) {
    this.transport.resume();
    if (stage !== undefined && this.lesson.weenieStage !== stage) {
      return;
    }
    this._isGoalWeenie = true;
    this.lesson.stage = stage;
    let goal = this.lesson.inStage && this.lesson.stages[stage];
    if (goal) {
      this.stage.standby(goal);
      if (this.powers.autoGoal) {
        this.stage.count('goal');
        if (this.transport.paused) {
          setTimeout(() => {
            this.transport.start();
          }, 0);
        }
      }
    } else {
      this.transport.stop();
    }
    this.player.init();
  }

  isStageWeenie(i: number) {
    return !this.lesson.inStage && this.lesson.weenieStage === i;
  }

  isGoalWeenie() {
    return this.lesson.inStage && this._isGoalWeenie && this.transport.paused;
  }

  isPlaybackWeenie() {
    return this.lesson.inStage && !this._isGoalWeenie &&
        this.player.noteCount === this.stage.goalNotes && this.transport.paused;
  }

  isGridWeenie() {
    return this.lesson.inStage && !this._isGoalWeenie && !this.player.noteCount &&
        this.transport.paused;
  }

  isNextWeenie() {
    return this.lesson.waitingForNext && !this.progress.powerUps.length;
  }

  get goalMode() {
    return this.powers.autoGoal && (this.stage.isCountGoal || this.stage.isGoal &&
        !this.transport.starting) ? 'auto' : 'listen'
  }

  onGoal() {
    if (this.stage.isStandby) {
      this.stage.goal(this.powers.autoLoop ? 'count' : 'standby',
          this._isGoalWeenie ? 0 : 5);
      this._isGoalWeenie = false;
      this.transport.start();
    } else if (this.stage.isCountGoal) {
      this.onStandby();
    }
  }

  onPlayback() {
    if (!this.isGoalWeenie() && this.player.noteCount) {
      this.stage.playback('standby');
      this.transport.start();
    }
  }

  onStopRepeat() {
    if (this.stage.isCount) {
      this.onStandby();
    } else {
      this.stage.next('standby');
    }
  }

  onNext() {
    this.transport.resume();
    this.powers.unhighlight();
    this.progress.next();
  }

  onStandby() {
    this.stage.standby();
    this.transport.stop();
  }

  onPower(powerUp: PowerUp) {
    let type = powerUp.type;
    let beat = this.movingBeat(powerUp.range);
    this.sound.playSequence('cowbell', ['A6'], '16n');
    let powerType = this.progress.power(type, beat);
    let level = this.progress.allowedPowers.level(powerType);
    if (level === this.powers.setting[powerType] + 1) {
      setTimeout(() => {
        this.powers.set(powerType, level);
      }, 250);

    }
    setTimeout(() => {
      this.powers.highlight(powerType);
    }, 500);
  }

  goalBeat() {
    return this.stage.isCountGoal && this.transport.beatIndex && this.transport.active();
  }

  playDisabled() {
    return this._isGoalWeenie || this.stage.isCountGoal || !this.player.noteCount ||
        this.stage.isGoal && this.stage.nextScene !== 'playback'
  }

  repeatBeat() {
    return this.transport.active() && (this.transport.beatIndex || this.stage.isGoal);
  }

  movingBeat(range: number[]) {
    return range && range[Math.floor(Date.now() / 750) % range.length];
  }

  playMinusSequence() {
    this.sound.playSequence('cowbell', ['F4', 'D4'], '32n');
  }

  isGrid(surface: Surface) {
    return surface instanceof Grid;
  }
}

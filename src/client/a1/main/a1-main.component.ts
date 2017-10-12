import * as _ from 'lodash';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { trigger, style, animate, state, transition, keyframes } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { Grid } from './grid/grid.model';
import { LessonService } from '../model/lesson/lesson.service';
import { PlayerService } from '../model/player/player.service';
import { ProgressService } from '../model/progress/progress.service';
import { StageService } from '../model/stage/stage.service';
import { Surface } from '../../common/surface/surface.model';
import { TransportService } from '../../common/core/transport.service';
import { ActivatedRoute } from '@angular/router';
import { Rhythm } from '../../common/core/rhythm.model';

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
      state('goal', style({ transform: 'translateY(-50vh) scale(0.1, 0.5)' })),
      state('playback', style({ transform: 'scale(0)' })),
      state('victory', style({ opacity: 0 })),
      transition('* => goal', [
        animate(250, keyframes([
          style({ transform: 'translateY(2vh) scale(1.2, 0.6)', offset: 0.2 }),
          style({ transform: 'translateY(0vh) scale(0.5, 1.2)', offset: 0.4 }),
          style({ transform: 'translateY(-50vh) scale(0.5, 1)', offset: 1 })
        ]))
      ]),
      transition('goal => standby', [
        animate(250, keyframes([
          style({ transform: 'translateY(-50vh) scale(0.5, 1)', offset: 0}),
          style({ transform: 'translateY(0vh) scale(0.5, 1.2)', offset: .6 }),
          style({ transform: 'translateY(2vh) scale(1.2, 0.6)', offset: .8 }),
          style({ transform: 'translateY(0) scale(1)', offset: 1 })
        ]))
      ]),
      transition('* => playback', [
        animate(250, keyframes([
          style({ transform: 'rotate(0) scale(1.2)', offset: 0.2 }),
          style({ transform: 'rotate(-10deg) scale(1.2)', offset: 0.5 }),
          style({ transform: 'rotate(45deg) scale(0)', offset: 1 })
        ]))
      ]),
      transition('playback => standby', [
        animate(250, keyframes([
          style({ transform: 'rotate(45deg) scale(1.2)', offset: 0.5 }),
          style({ transform: 'rotate(-10deg) scale(1.2)', offset: 0.8 }),
          style({ transform: 'rotate(0) scale(1)', offset: 1 })
        ]))
      ])
    ]),
    trigger('play', [
      state('goal', style({ transform: 'scale(0)' })),
      state('playback', style({ opacity: 0, transform: 'translateX(5vw) scale(0, 2)' })),
      state('victory', style({ opacity: 0 })),
      transition('* => goal', [
        animate(250, keyframes([
          style({ transform: 'rotate(0) scale(1.2)', offset: 0.2 }),
          style({ transform: 'rotate(-10deg) scale(1.2)', offset: 0.5 }),
          style({ transform: 'rotate(45deg) scale(0)', offset: 1 })
        ]))
      ]),
      transition('goal => standby', [
        animate(250, keyframes([
          style({ transform: 'rotate(45deg) scale(1.2)', offset: 0.5 }),
          style({ transform: 'rotate(-10deg) scale(1.2)', offset: 0.8 }),
          style({ transform: 'rotate(0) scale(1)', offset: 1 })
        ]))
      ]),
      transition('* => playback', [
        animate(250, keyframes([
          style({ opacity: 1, transform: 'translateX(0) scale(1)', offset: 0 }),
          style({ opacity: 1, transform: 'translateX(-1vw) scale(0.8, 1.1)', offset: 0.2 }),
          style({ opacity: 1, transform: 'translateX(-1vw) scale(0.6, 1.2)', offset: 0.5 }),
          style({ opacity: 0.5, transform: 'translateX(3vw) scale(1.5, 0.1)', offset: 0.9 }),
          style({ opacity: 0, transform: 'translateX(3vw) scale(0, 0)', offset: 1 })
        ]))
      ]),
      transition('playback => standby', [
        animate(250, keyframes([
          style({ opacity: 0, transform: 'translateX(3vw) scale(0, 0)', offset: 0 }),
          style({ opacity: 0.5, transform: 'translateX(3vw) scale(1.5, 0.1)', offset: 0.1 }),
          style({ opacity: 1, transform: 'translateX(-1vw) scale(0.6, 1.2)', offset: 0.6 }),
          style({ opacity: 1, transform: 'translateX(-1vw) scale(0.8, 1.1)', offset: 0.8 }),
          style({ opacity: 1, transform: 'translateX(0) scale(1)', offset: 1 })
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
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(250, style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate(500, style({ opacity:0, transform: 'scale(2)' }))
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
    trigger('zoomInOut', [
      transition(':enter', [
        style({ transform: 'scale(.5) translateY(30vh)' }),
        animate(500, style({ transform: 'scale(1) translateY(0)' }))
      ]),
      transition(':leave', [
        animate(500, style({ transform: 'scale(.5) translateY(30vh)' }))
      ])
    ])
  ]
})
export class A1MainComponent implements OnInit, OnDestroy {
  public showBall$: Observable<boolean>;
  public shouldStopAtTop: boolean = false;
  private _isGoalWeenie: boolean = false;

  constructor(public route: ActivatedRoute, public transport: TransportService,
              public player: PlayerService, public stage: StageService,
              public lesson: LessonService, public progress: ProgressService) {
    this.showBall$ = combineLatest(transport.paused$, transport.lastBeat$).map(
      ([paused, lastBeat]) => !paused && stage.isGoal && !lastBeat);
  }

  /**
   * Starts up the requestAnimationFrame loop so that the browser redraws the
   * UI as often as it can for a smooth refresh rate.
   */
  ngOnInit() {
    this.progress.init({
      rhythm: Rhythm.fromParam(this.route.snapshot.queryParams['p'] || '1111'),
      minNotes: _.parseInt(this.route.snapshot.queryParams['min']) || 3,
      maxNotes: _.parseInt(this.route.snapshot.queryParams['max']) || 16
    });

    this.transport.setOnTop((time) => this.onTop());
    this.transport.setOnPulse((time, beat, tick) => this.stage.pulse(time, beat, tick));

    function draw() {
      requestAnimationFrameId = requestAnimationFrame(draw);
    }
    draw();
  }

  ngOnDestroy() {
    window.cancelAnimationFrame(requestAnimationFrameId);
    this.transport.stop(true);
  }

  onTop() {
    if (this.stage.isVictory) {
      this.transport.stop();
      this.lesson.complete(this.stage.round, this.lesson.stage, this.stage.basePoints);
      this.onStage();
    } else if (this.stage.isPlayback && this.stage.goalPlayed) {
      this.shouldStopAtTop = false;
      this.stage.victory();
    } else if (this.stage.isGoal) {
      this._isGoalWeenie = false;
    }
    if (!this.shouldStopAtTop) {
      this.shouldStopAtTop = true;
    } else {
      this.stage.standby();
      this.transport.stop();
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') { // Enter: Weenie if possible
      if (this.isGoalWeenie()) {
        this.onGoal();
      } else if (this.isPlaybackWeenie()) {
        this.onPlayback();
      } else if (this.lesson.isCompleted) {
        this.onNext();
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
    } else if (!this.transport.starting) { // Key: Set, disallow while starting
      if (this.player.set(event.key, this.player.cursor)) {
        this.player.select(this.player.selected, this.player.cursor + 1);
      }
    }
    return false;
  }

  onStage(stage?: number) {
    if (stage !== undefined && this.lesson.pointsFor(stage)) {
      return;
    }
    this._isGoalWeenie = true;
    this.lesson.stage = stage;
    let goal = stage !== undefined && this.lesson.stages[stage];
    if (goal) {
      this.stage.standby(goal);
    }
    this.player.init();
  }

  isStageWeenie(i: number) {
    return this.lesson.stage === undefined && this.lesson.weenieStage === i;
  }

  isGoalWeenie() {
    return this._isGoalWeenie && this.transport.paused;
  }

  isPlaybackWeenie() {
    return this.player.noteCount === this.stage.goalNotes && this.transport.paused;
  }

  isGridWeenie() {
    return !this._isGoalWeenie && !this.player.noteCount && this.transport.paused;
  }

  onGoal() {
    this.shouldStopAtTop = false;
    this._isGoalWeenie = false;
    this.stage.goal();
    this.transport.start();
  }

  onPlayback() {
    this.shouldStopAtTop = false;
    this.stage.playback();
    this.transport.start();
  }

  onNext() {
    this.progress.result(this.lesson.result);
    this.progress.next();
  }

  isGrid(surface: Surface) {
    return surface instanceof Grid;
  }
}

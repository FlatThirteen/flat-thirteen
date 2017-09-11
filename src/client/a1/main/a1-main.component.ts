import * as _ from 'lodash';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
//import { Observable } from 'rxjs';
//import { combineLatest } from 'rxjs/observable/combineLatest';

import { Grid } from './grid/grid.model';
import { LessonService } from '../model/lesson/lesson.service';
import { PlayerService } from '../model/player/player.service';
import { StageService } from '../model/stage/stage.service';
import { Surface } from '../../common/surface/surface.model';
import { TransportService } from '../../common/core/transport.service';
import { ActivatedRoute } from '@angular/router';
import { Rhythm } from '../../common/core/rhythm.model';
import { Phrase } from '../../common/phrase/phrase.model';

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
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity:0 }),
        animate(200, style({ opacity:1 }))
      ]),
      transition(':leave', [
        animate(500, style({ opacity:0, transform: 'scale(2)'}))
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
  //public listenClass$: Observable<string>;
  public shouldStopAtTop: boolean = false;
  private _isGoalWeenie: boolean = false;

  constructor(public route: ActivatedRoute, public transport: TransportService,
              public player: PlayerService, public stage: StageService,
              public lesson: LessonService) {
    /*this.listenClass$ = combineLatest(stage.scene$, stage.active$, player.touched$).map(
        ([scene, active, touched]) =>
          scene === 'goal' && active && !this.transport.lastBeat() ? 'waiting' :
          scene === 'goal' && !active || touched ? 'enable' : '');*/
  }

  /**
   * Starts up the requestAnimationFrame loop so that the browser redraws the
   * UI as often as it can for a smooth refresh rate.
   */
  ngOnInit() {
    this.lesson.rhythm = Rhythm.fromParam(this.route.snapshot.queryParams['p'] || '1111');
    this.lesson.max = _.parseInt(this.route.snapshot.queryParams['max']);
    this.lesson.min = _.parseInt(this.route.snapshot.queryParams['min']);
    let grid = new Grid({a: 'kick'}, this.lesson.pulsesByBeat);
    this.lesson.initConstantPlan([grid], [
      new Phrase('kick@0:000,1:000,2:000,3:000'),
      new Phrase('kick@0:000,1:000,2:000'),
      new Phrase('kick@0:000,2:000,3:000'),
      new Phrase('kick@0:000,1:000,3:000')
    ]);
    this.player.init();
    this.transport.reset([this.lesson.beatsPerMeasure]);

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
      this.lesson.complete(this.stage.round, this.lesson.stage);
      this.onStage();
    } else if (this.stage.isPlayback && this.stage.goalPlayed) {
      this.shouldStopAtTop = false;
      this.stage.victory();
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
      } else if (this.isCompleted()) {
        this.onAgain();
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
    if (stage !== undefined && this.lesson.completed(stage)) {
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

  isCompleted() {
    return this.lesson.weenieStage === this.lesson.numberOfStages;
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

  onAgain() {
    let grid = new Grid({q: 'snare', a: 'kick'}, this.lesson.pulsesByBeat);
    this.lesson.initGeneratedPlan([grid], 4);
  }

  isGrid(surface: Surface) {
    return surface instanceof Grid;
  }
}

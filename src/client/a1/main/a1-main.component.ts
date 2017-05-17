import * as _ from 'lodash';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Observable } from 'rxjs';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { Grid } from './grid/grid.model';
import { LessonService } from '../../common/lesson/lesson.service';
import { PlayerService } from '../../common/player/player.service';
import { StageService } from '../../common/stage/stage.service';
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
  styleUrls: ['a1-main.component.styl']
})
export class A1MainComponent implements OnInit, OnDestroy {
  public listenClass$: Observable<string>;
  public showStart: boolean = false;

  constructor(public route: ActivatedRoute, public transport: TransportService,
              public player: PlayerService, public stage: StageService,
              public lesson: LessonService) {
    this.listenClass$ = combineLatest(stage.scene$, stage.active$, player.touched$).map(
        ([scene, active, touched]) =>
          scene === 'goal' && active && !this.transport.lastBeat() ? 'waiting' :
          scene === 'goal' && !active || scene === 'demo' && touched ? 'enable' : '');
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
    this.lesson.init([grid], {stages: 5});
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
    this.showStart = true;
    if (this.stage.goalPlayed) {
      if (this.stage.isVictory) {
        this.lesson.advance(this.stage.round);
        if (this.lesson.phraseBuilder) {
          this.player.init();
        } else {
          this.transport.stop();
          this.lesson.reset();
        }
      } else {
        this.stage.victory();
      }
    } else if (!this.stage.isLoop) {
      this.stage.next(this.stage.isCount && this.lesson.phraseBuilder);
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') { // Enter: Start/stop
      this.lesson.reset();
      if (this.transport.paused) {
        this.player.init();
        this.transport.start();
      } else {
        this.transport.stop();
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

  onListen() {
    if (this.transport.paused) {
      this.transport.start();
    }
    this.stage.listen();
  }

  onStart() {
    this.lesson.reset();
    this.player.init();
    this.transport.start();
  }

  onStop() {
    this.transport.stop();
    this.lesson.reset();
  }

  isGrid(surface: Surface) {
    return surface instanceof Grid;
  }
}
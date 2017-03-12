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
 * This class represents the lazy loaded A2Component.
 */
@Component({
  moduleId: module.id,
  selector: 'a2-main',
  templateUrl: 'a2-main.component.pug',
  styleUrls: ['a2-main.component.styl']
})
export class A2MainComponent implements OnInit, OnDestroy {
  private listenClass$: Observable<string>;
  private showStart: boolean = false;

  constructor(private route: ActivatedRoute, private transport: TransportService,
              private player: PlayerService, private stage: StageService,
              private lesson: LessonService) {
    this.listenClass$ = combineLatest(stage.scene$, stage.active$, player.touched$).map(
        ([scene, active, touched]) => scene === 'Goal' && active ? 'waiting' :
        scene === 'Goal' && !touched ? 'just' :
        (scene === 'Demo' || scene === 'Goal') && touched ? 'enable' : '');
  }

  /**
   * Starts up the requestAnimationFrame loop so that the browser redraws the
   * UI as often as it can for a smooth refresh rate.
   */
  ngOnInit() {
    this.lesson.rhythm = Rhythm.fromParam(this.route.snapshot.queryParams['p'] || '1111');
    this.lesson.max = _.parseInt(this.route.snapshot.queryParams['max']);
    this.lesson.min = _.parseInt(this.route.snapshot.queryParams['min']);
    let grid = new Grid({q: 'snare', a: 'kick'}, this.lesson.pulsesByBeat);
    this.lesson.init([grid], {stages: 5});
    this.player.init();
    this.transport.reset([this.lesson.beatsPerMeasure], this.lesson.supportedPulses);

    this.transport.setOnTop((time) => this.onTop());
    this.transport.setOnPulse((time, beat, pulse) => this.onPulse(time, beat, pulse));

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
      this.lesson.advance(this.stage.round);
      this.stage.victory();
      if (this.lesson.phraseBuilder) {
        this.player.init();
      } else {
        this.transport.stop();
        this.lesson.reset();
      }
    } else if (!this.stage.isLoop) {
      this.stage.next(this.stage.showCount && this.lesson.phraseBuilder);
    }
  }

  onPulse(time: number, beat: number, tick: number) {
    this.stage.pulse(time, beat, tick);
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
    } else { // Key: Set
      this.player.set(event.key, this.player.cursor);
      this.player.select(this.player.selected, this.player.cursor + 1);
    }
    return false;
  }

  onListen() {
    if (this.transport.paused) {
      this.transport.start();
    }
    this.stage.listen();
  }

  isGrid(surface: Surface) {
    return surface instanceof Grid;
  }
}

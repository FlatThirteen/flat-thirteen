import * as _ from 'lodash';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';

import { Grid } from "./grid/grid.model";
import { LessonService } from "../../lesson/lesson.service";
import { PlayerService } from "../../player/player.service";
import { StageService } from "../../stage/stage.service";
import { Surface } from "../../surface/surface.model";
import { TransportService } from "../../core/transport.service";
import { ActivatedRoute } from "@angular/router";
import { Rhythm } from "../../core/rhythm.model";

let requestAnimationFrameId: number;

/**
 * This class represents the lazy loaded A2Component.
 */
@Component({
  moduleId: module.id,
  selector: '.a2',
  templateUrl: 'a2.component.html',
  styleUrls: ['a2.component.css']
})
export class A2Component implements OnInit, OnDestroy {
  constructor(private route: ActivatedRoute, private transport: TransportService,
              private player: PlayerService, private stage: StageService,
              private lesson: LessonService) {}

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
    if (this.stage.goalPlayed) {
      this.lesson.advance(this.stage.round);
      this.stage.victory();
      if (this.lesson.phraseBuilder) {
        this.player.init();
      } else {
        this.transport.stop();
        this.lesson.reset();
      }
    } else {
      this.stage.next(this.stage.showCount && this.lesson.phraseBuilder);
    }
  }

  onPulse(time: number, beat: number, tick: number) {
    this.stage.pulse(time, beat, tick);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') { // Enter: Start/stop
      if (this.transport.paused) {
        this.transport.start();
        this.player.init();
      } else {
        this.transport.stop();
        this.lesson.reset();
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

  isGrid(surface: Surface) {
    return surface instanceof Grid;
  }
}

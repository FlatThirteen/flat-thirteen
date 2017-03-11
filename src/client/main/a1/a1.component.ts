import * as _ from 'lodash';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { Grid } from './grid/grid.model';
import { LessonService } from '../../common/lesson/lesson.service';
import { PlayerService } from '../../common/player/player.service';
import { StageService } from '../../common/stage/stage.service';
import { Surface } from '../../common/surface/surface.model';
import { TransportService } from '../../common/core/transport.service';

let requestAnimationFrameId: number;

/**
 * This class represents the lazy loaded A1Component.
 */
@Component({
  moduleId: module.id,
  selector: '.a1',
  templateUrl: 'a1.component.html',
  styleUrls: ['a1.component.css']
})
export class A1Component implements OnInit, OnDestroy {
  private renderer: string;
  private supportedPulses: number[];

  /**
   * Creates an instance of the A1Component.
   */
  constructor(private route: ActivatedRoute, private transport: TransportService,
              private player: PlayerService, private stage: StageService,
              private lesson: LessonService) {}

  /**
   * Starts up the requestAnimationFrame loop so that the browser redraws the
   * UI as often as it can for a smooth refresh rate.
   */
  ngOnInit() {
    this.renderer = this.route.snapshot.data['renderer'] || 'html';

    let grid = new Grid({snare: ['q', 'w', 'e', 'r'], kick: ['a', 's', 'd', 'f']},
      4, this.lesson.supportedPulses);
    this.lesson.init([grid], {});
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
    } else {
      let numKey = _.parseInt(event.key); // Number: Pulses
      if (_.includes(this.supportedPulses, numKey)) {
        this.player.pulses(this.player.selected, numKey);
      } else { // Key: Set
        this.player.set(event.key, this.player.cursor);
      }
    }
    return false;
  }

  isGrid(surface: Surface) {
    return surface instanceof Grid;
  }
}

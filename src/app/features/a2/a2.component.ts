import * as _ from 'lodash';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';

import { GoalService } from "../shared/goal.service";
import { Grid } from "./grid/grid.model";
import { MonophonicMonotonePhraseBuilder, PhraseBuilder } from "../../phrase/phrase.model";
import { PlayerService } from "../../player/player.service";
import { Rhythm } from "../../core/rhythm.model";
import { StageService } from "../../stage/stage.service";
import { Surface } from "../../surface/surface.model";
import { SurfaceService } from "../../surface/surface.service";
import { TransportService } from "../../core/transport.service";

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
  private surfaces: Surface[];
  private beatsPerMeasure: number;
  private pulsesByBeat: number[];
  private phraseBuilder: PhraseBuilder;

  /**
   * Creates an instance of the A2Component.
   */
  constructor(private transport: TransportService,
              private goal: GoalService, private player: PlayerService,
              private stage: StageService, private surface: SurfaceService) {}

  /**
   * Starts up the requestAnimationFrame loop so that the browser redraws the
   * UI as often as it can for a smooth refresh rate.
   */
  ngOnInit() {
    let rhythm = new Rhythm([[1, 0], [0.9, 0], 0.9, [0.9, 0, 0, 0]]);
    this.pulsesByBeat = rhythm.pulsesByBeat;
    this.beatsPerMeasure = this.pulsesByBeat.length;
    this.transport.reset([this.beatsPerMeasure], rhythm.supportedPulses);

    let grid = new Grid({q: 'snare', a: 'kick'}, this.pulsesByBeat);
    this.surfaces = [grid];
    this.player.init(this.surfaces);
    this.stage.init();

    this.phraseBuilder = new MonophonicMonotonePhraseBuilder(this.surface.soundNames,
      rhythm, 3, 7);
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
    if (this.goal.playedGoal()) {
      this.goal.newGoal(this.phraseBuilder);
      this.stage.nextRound(true);
      this.player.init(this.surfaces);
    } else {
      this.stage.nextRound(false);
      this.goal.clearPlayed();
    }
  }

  onPulse(time: number, beat: number, tick: number) {
    if (this.stage.isGoal()) {
      this.goal.playGoal(time, beat, tick);
    } else if (this.stage.isPlay()) {
      _.forEach(this.player.notesAt(beat, tick), note => {
        this.goal.playSound(note, beat, tick, time);
      });
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') { // Enter: Start/stop
      if (this.transport.paused) {
        this.transport.start();
        this.player.init(this.surfaces);
      } else {
        this.transport.stop();
        this.stage.reset();
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

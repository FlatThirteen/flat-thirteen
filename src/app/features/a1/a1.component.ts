import * as _ from 'lodash';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { BeatService } from "../shared/beat.service";
import { GoalService } from "../shared/goal.service";
import { Grid } from "../../surface/grid/grid.model";
import { MonophonicMonotonePhraseBuilder, PhraseBuilder } from "../../phrase/phrase.model";
import { PlayerService } from "../../player/player.service";
import { Rhythm } from "../../phrase/rhythm.model";
import { StageService } from "../shared/stage.service";
import { Surface } from "../../surface/surface.model";
import { SurfaceService } from "../../surface/surface.service";

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
  private surfaces: Surface[];
  private beatsPerMeasure: number;
  private supportedPulses: number[];
  private phraseBuilder: PhraseBuilder;

  /**
   * Creates an instance of the A1Component.
   */
  constructor(private route: ActivatedRoute, private beat: BeatService,
              private goal: GoalService, private player: PlayerService,
              private stage: StageService, private surface: SurfaceService) {}

  /**
   * Starts up the requestAnimationFrame loop so that the browser redraws the
   * UI as often as it can for a smooth refresh rate.
   */
  ngOnInit() {
    this.beatsPerMeasure = 4;
    this.supportedPulses = [1, 2];
    this.renderer = this.route.snapshot.data['renderer'] || 'html';
    this.beat.reset([this.beatsPerMeasure], this.supportedPulses);

    let grid = new Grid({snare: ['q', 'w', 'e', 'r'], kick: ['a', 's', 'd', 'f']},
      this.beatsPerMeasure, this.supportedPulses);
    this.surfaces = [grid];
    this.player.init(this.surfaces);

    this.phraseBuilder = new MonophonicMonotonePhraseBuilder(this.surface.soundNames,
      new Rhythm([[1, 0], [0.9, 0], [0.9, 0], [0.9, 0]]), 3, 7);
    this.beat.setOnTop((time) => this.onTop());
    this.beat.setOnPulse((time, beat, pulse) => this.onPulse(time, beat, pulse));

    function draw() {
      requestAnimationFrameId = requestAnimationFrame(draw);
    }
    draw();
  }

  ngOnDestroy() {
    window.cancelAnimationFrame(requestAnimationFrameId);
    this.beat.stop(true);
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
      if (this.beat.paused) {
        this.beat.start();
        this.player.init(this.surfaces);
      } else {
        this.beat.stop();
        this.stage.reset();
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

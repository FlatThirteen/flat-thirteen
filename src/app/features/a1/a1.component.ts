import * as _ from 'lodash';
import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { BeatService } from "../shared/beat.service";
import { GoalService } from "../shared/goal.service";
import { Grid } from "../shared/grid/grid";
import { MonophonicMonotonePhraseBuilder } from "../shared/phrase";
import { PlayerService } from "../../player/player.service";
import { StageService } from "../shared/stage.service";
import { Surface } from "../shared/surface";
import { SurfaceService } from "../shared/surface.service";

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
  private pulsesPerBeat: number;

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
    this.pulsesPerBeat = 1;
    this.renderer = this.route.snapshot.data['renderer'] || 'html';
    this.beat.reset([this.beatsPerMeasure], this.pulsesPerBeat);

    let grid = new Grid({snare: ['q', 'w', 'e', 'r'], kick: ['a', 's', 'd', 'f']}, this.beatsPerMeasure, this.pulsesPerBeat);
    this.surfaces = [grid];
    this.player.init(this.surfaces);

    this.beat.setOnTop((time: number) => this.onTop());
    this.beat.setOnPulse((time: number, measure: number, beat: number, pulse: number) => this.onPulse(time, beat, pulse));

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
      this.goal.newGoal(new MonophonicMonotonePhraseBuilder(this.surface.soundNames, [1, 0, 0, 0]));
      this.stage.nextRound(true);
      this.player.init(this.surfaces);
    } else {
      this.stage.nextRound(false);
      this.goal.clearPlayed();
    }
  }

  onPulse(time: number, beat: number, pulse: number) {
    if (this.stage.isGoal()) {
      this.goal.playGoal(time, beat);
    } else if (this.stage.isPlay()) {
      let dataForBeat = _.map(this.surface.keysByBeat[beat], key => this.player.data[key]);
      _.forEach(<Surface.Data[]>dataForBeat, data => {
        this.goal.playSound(beat, data.noteAt(beat), time);
      });
    }
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      if (this.beat.paused) {
        this.beat.start();
      } else {
        this.beat.stop();
        this.stage.reset();
      }
    } else if (event.key === ' ') {
      this.player.unset(this.player.selected);
    } else {
      let numKey = _.parseInt(event.key);
      if (numKey > 0 && numKey <= this.pulsesPerBeat) {
        this.player.pulses(this.player.selected, numKey);
      } else {
        this.player.set(event.key);
      }
    }
    return false;
  }

  isGrid(surface: Surface) {
    return surface instanceof Grid;
  }
}

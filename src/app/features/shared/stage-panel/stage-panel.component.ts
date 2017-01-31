import { Component, OnInit } from '@angular/core';

import { BeatService } from "../beat.service";
import { GoalService } from "../goal.service";
import { StageService, State } from "../stage.service";

/**
 * This class represents the lazy loaded A1Component.
 */
@Component({
  selector: 'stage-panel',
  templateUrl: 'stage-panel.component.html',
  styleUrls: ['stage-panel.component.css'],
})
export class StagePanelComponent implements OnInit {

  /**
   * Creates an instance of the A1Component.
   */
  constructor(private beat: BeatService,
              private goal: GoalService,
              private stage: StageService) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {

  }

  onStart() {
    this.beat.start();
  }

  onPause() {
    this.beat.stop();
    this.stage.reset();
  }

}

import { Component } from '@angular/core';

import { BeatService } from "../beat.service";
import { GoalService } from "../goal.service";
import { StageService } from "../../../stage/stage.service";

/**
 * This class represents the lazy loaded A1Component.
 */
@Component({
  selector: 'stage-panel',
  templateUrl: 'stage-panel.component.html',
  styleUrls: ['stage-panel.component.css'],
})
export class StagePanelComponent {

  /**
   * Creates an instance of the A1Component.
   */
  constructor(private beat: BeatService,
              private goal: GoalService,
              private stage: StageService) {}

  onStart() {
    this.beat.start();
  }

  onStop() {
    this.beat.stop();
    this.stage.reset();
  }

}

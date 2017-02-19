import { Component } from '@angular/core';

import { GoalService } from "../goal.service";
import { StageService } from "../../../stage/stage.service";
import { TransportService } from "../../../core/transport.service";

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
  constructor(private transport: TransportService,
              private goal: GoalService,
              private stage: StageService) {}

  onStart() {
    this.transport.start();
  }

  onStop() {
    this.transport.stop();
    this.stage.reset();
  }

}

import { Component } from '@angular/core';

import { LessonService } from "../../../lesson/lesson.service";
import { PlayerService } from "../../../player/player.service";
import { StageService } from "../../../stage/stage.service";
import { TransportService } from "../../../core/transport.service";

/**
 * This class represents the stage panel below the surfaces.
 */
@Component({
  selector: 'stage-panel',
  templateUrl: 'stage-panel.component.html',
  styleUrls: ['stage-panel.component.css'],
})
export class StagePanelComponent {

  constructor(private transport: TransportService,
              private lesson: LessonService,
              private player: PlayerService,
              private stage: StageService) {}

  onStart() {
    this.lesson.reset();
    this.player.init();
    this.transport.start();
  }

  onStop() {
    this.transport.stop();
    this.lesson.reset();

  }

}

import { Component } from '@angular/core';

import { LessonService } from '../../common/lesson/lesson.service';
import { PlayerService } from '../../common/player/player.service';
import { StageService } from '../../common/stage/stage.service';
import { TransportService } from '../../common/core/transport.service';

/**
 * This class represents the stage panel below the surfaces.
 */
@Component({
  selector: 'stage-panel',
  templateUrl: 'stage-panel.component.pug',
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

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
  styleUrls: ['stage-panel.component.styl'],
})
export class StagePanelComponent {

  constructor(public transport: TransportService,
              public lesson: LessonService,
              public player: PlayerService,
              public stage: StageService) {}

}

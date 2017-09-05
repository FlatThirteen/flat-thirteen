import { Component } from '@angular/core';

import { LessonService } from '../../model/lesson/lesson.service';
import { PlayerService } from '../../model/player/player.service';
import { StageService } from '../../model/stage/stage.service';
import { TransportService } from '../../../common/core/transport.service';

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

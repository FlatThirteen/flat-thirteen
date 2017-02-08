import { Component, Input, OnInit } from '@angular/core';

import { BeatService } from "../../../features/shared/beat.service";
import { Grid } from "../grid.model";
import { PlayerService } from "../../../player/player.service";
import { StageService } from "../../../features/shared/stage.service";

/**
 * This class represents the HTML version of the Grid Component.
 */
@Component({
  selector: 'html-grid',
  templateUrl: 'html-grid.component.html',
  styleUrls: ['html-grid.component.css'],
})
export class HtmlGridComponent implements OnInit {
  @Input() private grid: Grid;

  constructor(private beat: BeatService, private player: PlayerService,
              private stage: StageService) {}

  ngOnInit() {
    if (!this.grid) {
      throw new Error('Missing grid');
    }
  }
}

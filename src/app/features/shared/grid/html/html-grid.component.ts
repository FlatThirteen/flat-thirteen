import { Component, Input } from '@angular/core';

import { BeatService } from "../../beat.service";
import { Grid } from "../grid";
import { PlayerService } from "../../../../player/player.service";
import { StageService } from "../../stage.service";

/**
 * This class represents the HTML version of the Grid Component.
 */
@Component({
  selector: 'html-grid',
  templateUrl: 'html-grid.component.html',
  styleUrls: ['html-grid.component.css'],
})
export class HtmlGridComponent {
  @Input() private grid: Grid;

  constructor(private beat: BeatService, private player: PlayerService,
              private stage: StageService) {}
}

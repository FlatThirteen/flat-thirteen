import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';

import { Grid } from "../grid.model";
import { PlayerService } from "../../../../player/player.service";
import { StageService } from "../../../../stage/stage.service";
import { TransportService } from "../../../../core/transport.service";

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

  constructor(private transport: TransportService, private player: PlayerService,
              private stage: StageService) {}

  ngOnInit() {
    if (!this.grid) {
      throw new Error('Missing grid');
    }
  }

  gridClass() {
    return _.assign({
      selected: this.grid.listens(this.player.selected)
    }, _.fromPairs([[this.stage.getCurrentScene().toLowerCase(), true]]));
  }

  pulsesFor(beat: number) {
    let offset = _.sum(this.grid.pulsesByBeat.slice(0, beat));
    return _.times(this.grid.pulsesByBeat[beat], (i) => offset + i);
  }
}

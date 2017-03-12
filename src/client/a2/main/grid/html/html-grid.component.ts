import * as _ from 'lodash';
import { Component, Input, OnInit } from '@angular/core';

import { Observable } from 'rxjs';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { Grid } from '../grid.model';
import { PlayerService } from '../../../../common/player/player.service';
import { StageService } from '../../../../common/stage/stage.service';
import { TransportService } from '../../../../common/core/transport.service';

/**
 * This class represents the HTML version of the Grid Component.
 */
@Component({
  selector: 'html-grid',
  templateUrl: 'html-grid.component.pug',
  styleUrls: ['html-grid.component.styl'],
})
export class HtmlGridComponent implements OnInit {
  @Input() private grid: Grid;
  private gridClass$: Observable<string>;

  constructor(private transport: TransportService, private player: PlayerService,
              private stage: StageService) {
    this.gridClass$ = combineLatest(stage.scene$, player.selected$).map(
        ([scene, selected]) => scene.toLowerCase() + (this.grid.listens(selected) ? ' selected' : ''));
  }

  ngOnInit() {
    if (!this.grid) {
      throw new Error('Missing grid');
    }
  }

  pulsesFor(beat: number) {
    let offset = _.sum(this.grid.pulsesByBeat.slice(0, beat));
    return _.times(this.grid.pulsesByBeat[beat], (i) => offset + i);
  }
}

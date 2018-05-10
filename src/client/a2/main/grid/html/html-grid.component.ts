import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { Component, Input, OnInit } from '@angular/core';

import { TransportService } from '../../../../common/core/transport.service';

import { PlayerService } from '../../../model/player/player.service';
import { StageService } from '../../../model/stage/stage.service';

import { Grid } from '../grid.model';

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
  public gridClass$: Observable<string>;
  public particleCount$: Observable<number>;
  public particleType: string;

  constructor(public transport: TransportService, public player: PlayerService,
              public stage: StageService) {
    this.gridClass$ = combineLatest(stage.scene$, player.selected$).map(
        ([scene, selected]) => scene + (this.grid.listens(selected) ? ' selected' : ''));
    this.particleCount$ = stage.scene$.map(scene => {
      if (scene === 'victory') {
        this.particleType = 'confetti';
      }
      return scene !== 'victory' ? 0 : stage.basePoints;
    });
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

  noteClass(pulses: number) {
    return {
      1: 'quarter',
      2: 'eighth',
      3: 'triplet',
      4: 'sixteenth'
    }[pulses];
  }

  controlNoteClass(key: string, pulseIndex: number, pulses: number) {
    return this.noteClass(pulses) + (this.player.value(key, pulseIndex) ? ' on' : '');
  }
}

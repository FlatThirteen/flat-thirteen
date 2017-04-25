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

  pulseClass(beat, pulse, pulses, pulseIndex) {
    return {
      active: this.transport.active(beat, pulse, pulses),
      cursor: this.player.cursor === pulseIndex
    };
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

  eyesClass(beat: number) {
    return {
      'look-left': this.player.beat + 1 === beat,
      'look-right': this.player.beat - 1 === beat,
      wrong: (this.stage.beatWrong === beat) && (this.player.noteCount === this.stage.goalNotes)
    }
  }
}

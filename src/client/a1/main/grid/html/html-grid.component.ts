import * as _ from 'lodash';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';

import { Subscription, Observable } from 'rxjs';
import { combineLatest } from 'rxjs/observable/combineLatest';

import { Grid } from '../grid.model';
import { PlayerService } from '../../../model/player/player.service';
import { StageService } from '../../../model/stage/stage.service';
import { TransportService } from '../../../../common/core/transport.service';
import { pulseFrom } from '../../../../common/core/beat-tick.model';

/**
 * This class represents the HTML version of the Grid Component.
 */
@Component({
  selector: 'html-grid',
  templateUrl: 'html-grid.component.pug',
  styleUrls: ['html-grid.component.styl'],
})
export class HtmlGridComponent implements OnInit, OnDestroy {
  @Input() private grid: Grid;
  private subscriptions: Subscription[];
  public gridClass$: Observable<string>;
  public particleCount$: Observable<number>;
  public particleType: string;
  public activeNote: number;
  public activePulseIndex: number;

  constructor(public transport: TransportService, public player: PlayerService,
              public stage: StageService) {
    this.gridClass$ = combineLatest(stage.scene$, player.selected$).map(
        ([scene, selected]) => scene + (this.grid.listens(selected) ? ' selected' : ''));
    this.particleCount$ = stage.scene$.map(scene => {
      this.activeNote = undefined;
      this.activePulseIndex = undefined;
      if (scene === 'victory') {
        this.particleType = 'confetti';
      }
      return scene !== 'victory' ? 0 : stage.basePoints;
    });

    this.subscriptions = [
      this.transport.pulse$.subscribe(pulse => {
        let pulseIndexesForBeat = this.pulsesFor(pulse.beat);
        let pulseWithinBeat = pulseFrom(pulse.tick, this.grid.pulsesByBeat[pulse.beat]);
        let pulseIndex = pulseIndexesForBeat[pulseWithinBeat];
        if (pulseIndex !== undefined) {
          this.activePulseIndex = pulseIndex;
        }
      })
    ];
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

  noteActive(pulseIndex: number) {
    return this.stage.isStandby ? this.activeNote === pulseIndex :
        this.activePulseIndex === pulseIndex;
  }

  controlNoteClass(key: string, pulseIndex: number, pulses: number) {
    return this.noteClass(pulses) + (this.player.value(key, pulseIndex) ? ' on' : '');
  }

  onNote(key: string, pulseIndex: number) {
    if (!this.transport.starting) {
      if (this.player.value(key, pulseIndex)) {
        this.player.unset(key, pulseIndex);
      } else {
        this.player.set(key, pulseIndex);
        this.activeNote = pulseIndex;
      }
    }
  }

  ngOnDestroy() {
    _.invokeMap(this.subscriptions, 'unsubscribe');
  }
}

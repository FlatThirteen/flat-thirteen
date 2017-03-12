import * as _ from 'lodash';
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { PlayerService } from '../../../../common/player/player.service';
import { TransportService } from '../../../../common/core/transport.service';

/**
 * The BeatComponent is used by html-grid to represent a single note box
 * in the grid.
 */
@Component({
  selector: '.beat',
  templateUrl: 'beat.component.html',
  styleUrls: ['beat.component.css'],
})
export class BeatComponent {
  @Input() private pulses: number;
  @Input() private beat: number;
  @Input() private key: string;

  constructor(private transport: TransportService, private player: PlayerService) {}

  pulseCounts() {
    return _.times(this.pulses);
  }

  noteType() {
    return noteTypes[this.pulses];
  }

  controlNoteClasses(pulse: number) {
    return _.assign({
      on: this.player.value(this.key, pulse),
      cursor: this.player.cursor === pulse
    }, _.fromPairs([[this.noteType(), true]]));
  }
}

const noteTypes = {
  1: 'quarter',
  2: 'eighth',
  3: 'triplet',
  4: 'sixteenth'
};

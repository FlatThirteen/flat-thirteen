import * as _ from 'lodash';
import { Component, Input, HostListener } from '@angular/core';

import { BeatService } from "../../../features/shared/beat.service";
import { PlayerService } from "../../../player/player.service";

/**
 * The BeatComponent is used by html-grid to represent a single note box
 * in the grid.  Each BeatComponent is only identified by its key, which
 * should be unique across all surfaces active in the UI.
 */
@Component({
  selector: '.beat',
  templateUrl: 'beat.component.html',
  styleUrls: ['beat.component.css'],
})
export class BeatComponent {
  @Input() private pulses: number;
  @Input('beat') private thisBeat: number;
  @Input() private key: string;

  constructor(private beat: BeatService, private player: PlayerService) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.player.select(this.key);
  }

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

  onNote(pulse: number) {
    this.player.toggle(this.key, pulse);
  }
}

const noteTypes = {
  1: 'quarter',
  2: 'eighth',
  3: 'triplet',
  4: 'sixteenth'
};

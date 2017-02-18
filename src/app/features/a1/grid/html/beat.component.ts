import * as _ from 'lodash';
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { BeatService } from "../../../shared/beat.service";

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
  @Input('beat') private thisBeat: number;

  @Input() private label: string;
  @Input() private selected: boolean;
  @Input() private values: boolean[];
  @Input() private cursor: number;

  @Output() toggle = new EventEmitter<number>();

  constructor(private beat: BeatService) {}

  pulseCounts() {
    return _.times(this.pulses);
  }

  noteType() {
    return noteTypes[this.pulses];
  }

  controlNoteClasses(pulse: number) {
    return _.assign({
      on: this.values[pulse],
      cursor: this.cursor === pulse
    }, _.fromPairs([[this.noteType(), true]]));
  }

  onToggle(pulse: number) {
    this.toggle.emit(pulse);
  }
}

const noteTypes = {
  1: 'quarter',
  2: 'eighth',
  3: 'triplet',
  4: 'sixteenth'
};

import * as _ from 'lodash';
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { TransportService } from "../../../../core/transport.service";

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
  @Input() private pulses: number[];
  @Input('beat') private thisBeat: number;

  @Input() private label: string;
  @Input() private values: boolean[];
  @Input() private cursor: number;

  @Output() toggle = new EventEmitter<number>();
  @Output() enter = new EventEmitter<number>();

  constructor(private transport: TransportService) {}

  noteClass() {
    return noteTypes[this.pulses.length];
  }

  controlNoteClass(pulse: number) {
    return _.assign({
      on: this.values[pulse - this.pulses[0]]
    }, _.fromPairs([[this.noteClass(), true]]));
  }

  onToggle(pulse: number) {
    this.toggle.emit(pulse);
  }

  onEnter(pulse: number) {
    this.enter.emit(pulse);
  }
}

const noteTypes = {
  1: 'quarter',
  2: 'eighth',
  3: 'triplet',
  4: 'sixteenth'
};

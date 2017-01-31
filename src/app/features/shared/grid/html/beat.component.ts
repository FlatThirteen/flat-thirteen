import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';

import { BeatService } from "../../beat.service";
import { GridService } from '../grid.service';
import { StageService } from "../../stage.service";

/**
 * This class represents the Beat Component used by html-grid.
 */
@Component({
  selector: '.beat',
  templateUrl: 'beat.component.html',
  styleUrls: ['beat.component.css'],

})
export class BeatComponent implements OnInit {
  @Input() private subdivisions: number[] = [1];
  @Input() private shortcutKey: string;
  @Input() private state: number;
  @Input() private selected: string;
  @Output() private stateChange = new EventEmitter<number>();
  @Output() private selectChange = new EventEmitter<string>();


  /**
   * Creates an instance of the A1Component.
   */
  constructor(private beat: BeatService,
              private grid: GridService,
              private stage: StageService) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {

  }

  @HostListener('mouseenter') onMouseEnter() {
    // console.log('Enter', this.shortcutKey, 'from', this.selected);
    this.selectChange.emit(this.shortcutKey);
  }

  @HostListener('mouseleave') onMouseLeave() {
    // console.log('Leave', this.shortcutKey, 'from', this.selected);
    if (this.shortcutKey === this.selected) {
      this.selectChange.emit();
    } else {
      // This doesn't have any impact so long as the controls inside the beat
      // component don't have any exit animation.  If we do add it though, we
      // get other beat components showing the exit animation when we toggle
      // a beat box.  This bug happened even when using only :hover to trigger
      // the controls, instead of the "selected" variable in HtmlGrid.
      console.log('WTF, we supposedly left ' + this.shortcutKey + ' even though we\'re actually in ' + this.selected);
    }
  }

  onQuarter() {
    this.stateChange.emit(this.state ? 0 : 1);
  }

  setSubdivision(subdivision: number) {
    // TODO
    console.log('Set subdivision ' + subdivision);
  }
}

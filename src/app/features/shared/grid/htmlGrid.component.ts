import { Component, OnInit } from '@angular/core';

import { KickSound, SnareSound } from "../sounds/sound";
import { BeatService } from "../beat.service";
import { GridService } from './grid.service';

/**
 * This class represents the lazy loaded A1Component.
 */
@Component({
  selector: 'html-grid',
  templateUrl: 'htmlGrid.component.html',
  styleUrls: ['htmlGrid.component.css'],
})
export class HtmlGridComponent implements OnInit {

  /**
   * Creates an instance of the A1Component.
   */
  constructor(private beat: BeatService, private grid: GridService) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.beat.reset();
    this.grid.resetStage([new SnareSound(), new KickSound]);
  }

  onToggle(stripIndex: number, beatIndex: number) {
    this.grid.onToggle(stripIndex, beatIndex); // Replace with ACTION
  }

}

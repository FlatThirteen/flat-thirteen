import { Component, OnInit } from '@angular/core';

import { KickInstrument, SnareInstrument } from "../instruments/instrument";
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
  constructor(private grid: GridService) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.grid.resetStage([new SnareInstrument(), new KickInstrument], 4);
  }

  onToggle(stripIndex: number, beatIndex: number) {
    this.grid.onToggle(stripIndex, beatIndex); // Replace with ACTION
  }

}

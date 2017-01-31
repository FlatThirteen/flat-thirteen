import { Component, OnInit } from '@angular/core';

import { KickSound, SnareSound } from "../sounds/sound";
import { BeatService } from "../beat.service";
import { GridService } from './grid.service';
import { StageService } from "../stage.service";

/**
 * This class represents the HTML version of the Grid Component.
 */
@Component({
  selector: 'html-grid',
  templateUrl: 'html-grid.component.html',
  styleUrls: ['html-grid.component.css'],
})
export class HtmlGridComponent implements OnInit {
  private selected: string;

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
    this.grid.resetStage([new SnareSound(), new KickSound]);
  }

  select(stripIndex: number, beatIndex: number, shortcutKey: string) {
    // console.log('Selected', stripIndex, beatIndex, shortcutKey, 'was', this.selected);
    this.selected = shortcutKey;
  }

  onToggle(stripIndex: number, beatIndex: number) {
    // console.log('Toggle', stripIndex, beatIndex, ' selected is ', this.selected);
    this.grid.onToggle(stripIndex, beatIndex); // Replace with ACTION
  }

}

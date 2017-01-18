import { Component, OnInit, } from '@angular/core';
import { KickInstrument, SnareInstrument} from '../shared/instruments/instrument';
import { Grid } from '../shared/grid/grid';

import * as Tone from 'tone';

import { PixiGridComponent } from '../shared/grid/pixi/pixiGrid.component';

/**
 * This class represents the lazy loaded A1Component.
 */
@Component({
  moduleId: module.id,
  selector: '.a1',
  templateUrl: 'a1.component.html',
  styleUrls: ['a1.component.css']
})
export class A1Component implements OnInit {
  gridLoop: Tone.Loop;
  noteLoop: Tone.Loop;
  grid: Grid;

  /**
   * Creates an instance of the A1Component.
   */
  constructor() {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    this.grid = new Grid([new SnareInstrument(), new KickInstrument], 4);

    this.gridLoop = new Tone.Loop((time) => { this.grid.onTop() }, '1m');
    this.gridLoop.start(0);

    this.noteLoop = new Tone.Loop((time) => { this.grid.onBeat() }, '4n');
    this.noteLoop.start(0);

    Tone.Transport.start();

    function draw() {
      requestAnimationFrame(draw);
    }
    draw();
  }

  ngOnDestroy() {
    this.gridLoop.stop(0);
    this.gridLoop.dispose();
    this.noteLoop.stop(0);
    this.noteLoop.dispose();
    Tone.Transport.stop(0);
  }

  setBeatState(stripIndex: number, beatIndex: number) {
    this.grid.onToggle(stripIndex, beatIndex, this.noteLoop.progress);
  }
}

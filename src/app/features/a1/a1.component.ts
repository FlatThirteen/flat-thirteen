import { Component, OnInit, OnDestroy } from '@angular/core';

import { GridService } from "../shared/grid/grid.service";

let requestAnimationFrameId: number;

/**
 * This class represents the lazy loaded A1Component.
 */
@Component({
  moduleId: module.id,
  selector: '.a1',
  templateUrl: 'a1.component.html',
  styleUrls: ['a1.component.css']
})
export class A1Component implements OnInit, OnDestroy {

  /**
   * Creates an instance of the A1Component.
   */
  constructor(private grid: GridService) {}

  /**
   * Get the names OnInit
   */
  ngOnInit() {
    function draw() {
      requestAnimationFrameId = requestAnimationFrame(draw);
    }
    draw();
  }

  ngOnDestroy() {
    window.cancelAnimationFrame(requestAnimationFrameId);
    this.grid.stop(true);
  }

}

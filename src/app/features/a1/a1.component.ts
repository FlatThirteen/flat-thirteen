import { Component, OnInit, OnDestroy } from '@angular/core';

import { BeatService } from "../shared/beat.service";
import { GoalService } from "../shared/goal.service";
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
  constructor(private beat: BeatService, private goal: GoalService, private grid: GridService) {}

  /**
   * Starts up the requestAnimationFrame loop so that the browser redraws the
   * UI as often as it can for a smooth refresh rate.
   */
  ngOnInit() {
    function draw() {
      requestAnimationFrameId = requestAnimationFrame(draw);
    }
    draw();
  }

  ngOnDestroy() {
    window.cancelAnimationFrame(requestAnimationFrameId);
    this.beat.stop(true);
  }

}

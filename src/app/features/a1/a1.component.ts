import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { ActivatedRoute } from "@angular/router";

import { BeatService } from "../shared/beat.service";
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
  private renderer: string;

  /**
   * Creates an instance of the A1Component.
   */
  constructor(private route: ActivatedRoute, private beat: BeatService, private grid: GridService) {}

  /**
   * Starts up the requestAnimationFrame loop so that the browser redraws the
   * UI as often as it can for a smooth refresh rate.
   */
  ngOnInit() {
    this.beat.reset();
    this.renderer = this.route.snapshot.data['renderer'] || 'html';
    function draw() {
      requestAnimationFrameId = requestAnimationFrame(draw);
    }
    draw();
  }

  ngOnDestroy() {
    window.cancelAnimationFrame(requestAnimationFrameId);
    this.beat.stop(true);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    this.grid.onKeyDown(event.key);
    console.log(' down:', event);
    return false;
  }
}

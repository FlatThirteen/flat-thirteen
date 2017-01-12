/// <reference path="../../../third_party/Tone.d.ts"/>

import { Component, OnInit, } from '@angular/core';
import { KickInstrument, SnareInstrument} from '../shared/instruments/instrument';
import { Grid } from '../shared/grid/grid';

const livePlayWithin: number = 0.3;

enum State {
  Count,
  Demo,
  Play,
  Victory
}

/**
 * This class represents the lazy loaded A1Component.
 */
@Component({
  moduleId: module.id,
  selector: 'sd-a1',
  templateUrl: 'a1.component.html',
  styleUrls: ['a1.component.css'],
})
export class A1Component implements OnInit {
  gridLoop: Tone.Loop;
  noteLoop: Tone.Loop;
  state: State;
  nextState: State = State.Count;
  round: number = 0;
  beat: number = 0;
  lastDelay: number = 0;
  active: boolean = false;
  inactiveRounds: number = 0;

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

    this.gridLoop = new Tone.Loop((time) => {
      if (this.grid.reachedGoal()) {
        this.grid = new Grid([new SnareInstrument(), new KickInstrument], 4);
        this.nextState = State.Victory;
      } else if (this.active) {
        this.inactiveRounds = 0;
      } else if (this.inactiveRounds >= 3) {
        this.nextState = State.Demo;
      }
      this.state = this.nextState;
      this.active = false;
      this.beat = 0;
      switch(this.state) {
        case State.Count:
        case State.Victory:
          this.nextState = State.Demo;
          this.round = 0;

          break;
        case State.Demo:
          this.nextState = State.Play;
          this.inactiveRounds = 0;
          break;
        case State.Play:
          this.round++;
          if (!this.active) {
            this.inactiveRounds++;
          } else {
            this.inactiveRounds = 0;
          }
      }
    }, '1m');
    this.gridLoop.start(0);

    this.noteLoop = new Tone.Loop((time) => {
      if (this.state === State.Demo) {
        this.grid.playGoal(this.beat);
      } else {
        this.grid.playBeat(this.beat);
      }
      this.beat++;
    }, '4n');
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
    if (this.state === State.Count || this.state === State.Victory) {
      return;
    }
    this.active = true;
    this.grid.toggle(stripIndex, beatIndex, () => {
      if (beatIndex !== this.beat - 1) {
        this.lastDelay = 0;
        return false;
      }
      this.lastDelay = this.noteLoop.progress;
      return this.noteLoop.progress < livePlayWithin;
    });
  }

  stateName() {
    return State[this.state];
  }

  showCount() {
    return this.state === State.Count || this.state === State.Victory;
  }

  showPosition() {
    return this.state === State.Demo || this.state === State.Play;
  }
}

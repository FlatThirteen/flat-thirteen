import { Injectable } from '@angular/core';

import * as _ from 'lodash';

import { Sound } from '../sounds/sound';
import { BeatService } from "../beat.service";
import { GoalService } from "../goal.service";
import { MonophonicMonotonePhraseBuilder } from "../phrase";
import { Note } from "../note";


enum State {
  Count,
  Demo,
  Play,
  Victory
}

@Injectable()
export class GridService {
  state: State;
  nextState: State = State.Count;
  round: number = 0;
  active: boolean = false;
  inactiveRounds: number = 0;

  numStrips: number;
  sounds: Sound[];
  gridValues: number[][];

  constructor(private beat: BeatService, private goal: GoalService) {
    beat.setOnTop((time: number) => this.onTop(time));
    beat.setOnPulse((time: number, measure: number, beat: number, pulse: number) => this.onPulse(time, beat));
  }

  resetStage(sounds?: Sound[]) {
    this.sounds = sounds || this.sounds;
    this.numStrips = this.sounds.length;
    this.gridValues = _.times(this.numStrips, () => _.fill(Array(this.beat.numBeats), 0));
    this.goal.newGoal(new MonophonicMonotonePhraseBuilder(this.sounds, [1, 0, 0, 0]));
  }

  onTop(time: number) {
    if (this.goal.playedGoal()) {
      this.resetStage();
      this.nextState = State.Victory;
    } else {
      this.goal.clearPlayed();
      if (this.active) {
        this.inactiveRounds = 0;
      } else if (this.inactiveRounds >= 3) {
        this.nextState = State.Demo;
      }
    }

    this.state = this.nextState;
    this.active = false;
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
  }

  onPulse(time: number, pulseIndex: number) {
    if (this.state === State.Demo) {
      this.goal.playGoal(time, pulseIndex);
    } else {
      _.times(this.numStrips, (i) => {
        if (this.gridValues[i][pulseIndex]) {
          this.goal.playSound(pulseIndex, new Note(this.sounds[i]), time);
        }
      });
    }
  }

  onToggle(stripIndex: number, beatIndex: number) {
    if (this.state === State.Count || this.state === State.Victory) {
      return;
    }
    this.active = true;
    this.gridValues[stripIndex][beatIndex] =
      this.gridValues[stripIndex][beatIndex] ? 0 : 1;
    if (this.gridValues[stripIndex][beatIndex] && this.beat.canLivePlay(beatIndex)) {
      this.goal.playSound(beatIndex, new Note(this.sounds[stripIndex]));
    }
  }

  public stateName() {
    return State[this.state];
  }

  public getStateName() {
    let name = '';
    switch(this.state) {
      case State.Count:
        name = 'count';
        break;
      case State.Victory:
        name = 'victory';
        break;
      case State.Demo:
        name = 'demo';
        break;
      case State.Play:
        name = 'play';
        break;
    }

    return name;
  }

  showOverlay() {
    return this.beat.paused || this.state === State.Count || this.state === State.Victory;
  }

  showPosition() {
    return this.state === State.Demo || this.state === State.Play;
  }

  getStripCount() {
    return this.numStrips;
  }
}

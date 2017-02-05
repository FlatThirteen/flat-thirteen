import { Injectable } from '@angular/core';

import * as _ from 'lodash';

import { Sound } from '../sounds/sound';
import { BeatService } from "../beat.service";
import { GoalService } from "../goal.service";
import { StageService } from "../stage.service";
import { MonophonicMonotonePhraseBuilder } from "../phrase";
import { Note } from "../note";

@Injectable()
export class GridService {
  private numStrips: number;
  private sounds: Sound[];
  private gridValues: number[][];
  private shortcutMap: Map<string, Function> = new Map<string, Function>();

  constructor(private beat: BeatService, private goal: GoalService, private stage: StageService) {
    beat.setOnTop((time: number) => this.onTop(time));
    beat.setOnPulse((time: number, measure: number, beat: number, pulse: number) => this.onPulse(time, beat));
  }

  resetStage(sounds?: Sound[]) {
    this.sounds = sounds || this.sounds;
    this.numStrips = this.sounds.length;
    this.gridValues = _.times(this.numStrips, () => _.fill(Array(this.beat.numBeats), 0));
    this.goal.newGoal(new MonophonicMonotonePhraseBuilder(this.sounds, [1, 0, 0, 0]));
    for (let i = 0; i < this.numStrips; i++) {
      for (let j = 0; j < this.beat.numBeats; j++) {
        this.shortcutMap[shortcuts[i][j]] = () => this.onToggle(i, j);
      }
    }
  }

  onTop(time: number) {
    if (this.goal.playedGoal()) {
      this.resetStage();
      this.stage.nextRound(true);
    } else {
      this.stage.nextRound(false);
      this.goal.clearPlayed();
    }
  }

  onPulse(time: number, pulse: number) {
    if (this.stage.isGoal()) {
      this.goal.playGoal(time, pulse);
    } else if (this.stage.isPlay()) {
      _.times(this.numStrips, (i) => {
        if (this.gridValues[i][pulse]) {
          this.goal.playSound(pulse, new Note(this.sounds[i]), time);
        }
      });
    }
  }

  onToggle(strip: number, beat: number) {
    if (this.stage.shouldShowCount()) {
      return;
    } else if (!this.stage.isDemo()) {
      this.stage.setActive();
    }
    let pulse = beat;
    this.gridValues[strip][beat] = this.gridValues[strip][beat] ? 0 : 1;
    if (this.gridValues[strip][beat]) {
      if (this.stage.isDemo()) {
        this.sounds[strip].play();
      } else if (this.beat.canLivePlay(pulse)) {
        this.goal.playSound(beat, new Note(this.sounds[strip]));
      }
    }
  }

  getGridValue(strip: number, beat: number) {
    return this.gridValues[strip][beat];
  }

  shortcutKey(strip: number, beat: number) {
    return shortcuts[strip][beat];
  }

  shortcutKeyArray(strip: number) {
    return shortcuts[strip];
  }

  onKeyDown(key: string) {
    return this.shortcutMap[key] && this.shortcutMap[key]();
  }

  getStripCount() {
    return this.numStrips;
  }
}

let shortcuts = [['q', 'w', 'e', 'r'], ['a', 's', 'd', 'f'], ['z', 'x', 'c', 'v']];

import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import * as Tone from 'tone';

import { SoundService } from "./sound/sound.service";

export const ticksPerBeat = Tone.Transport.PPQ; // 192
const livePlayWithin: number = 0.3;

@Injectable()
export class BeatService {
  quarterLoop: Tone.Loop;
  pulsesPart: Tone.Part;

  beatsPerMeasure: number[];

  numBeats: number;

  measure: number = 0;
  beat: number = 0;
  beatIndex: number = 0;

  onTopId: number;
  onPulse: (time: number, beat: number, pulse: number) => any;

  paused: boolean = true;

  constructor(private sound: SoundService) {}

  reset(beatsPerMeasure: number[] = [4],
        supportedPulses: number[] = [1]) {
    this.beatsPerMeasure = beatsPerMeasure;

    this.numBeats = _.reduce(beatsPerMeasure, (sum: number, n: number) => sum + n);

    this.measure = 0;
    this.beat = 0;
    this.beatIndex = -1;

    Tone.Transport.loop = true;
    Tone.Transport.setLoopPoints(0, beatsPerMeasure.length + 'm');

    this.quarterLoop = new Tone.Loop((time: number) => {
      this.beatIndex++;
      this.sound.play('click', time, this.beat ? 'normal' : 'heavy');

      if (this.onPulse) {
        this.onPulse(time, this.beatIndex, 0);
      }

      this.beat++;
      if (this.beat === beatsPerMeasure[this.measure]) {
        this.beat = 0;
        this.measure++;
      }
    }, '4n');
    this.quarterLoop.start(0);

    let tickEvents = _.transform(supportedPulses, (result, pulses) => {
      let ticks = ticksPerBeat / pulses;
      _.times(pulses - 1, (i) => {
        let time = ticks * (i + 1) + 'i';
        result[time] = ticks * (i + 1);
      });
    }, {});
    this.pulsesPart = new Tone.Part((time: number, tick) => {
      if (this.onPulse) {
        this.onPulse(time, this.beatIndex, tick);
      }
    }, _.toPairs(tickEvents));
    this.pulsesPart.loop = true;
    this.pulsesPart.loopEnd = '4n';
    this.pulsesPart.start(0);
  }

  setOnTop(callback: (time: number) => any) {
    if (this.onTopId !== undefined) {
      Tone.Transport.clear(this.onTopId);
    }
    this.onTopId = Tone.Transport.schedule((time) => {
      this.measure = 0;
      this.beatIndex = -1;
      return callback(time);
    }, 0);
  }

  setOnPulse(callback: (time: number, beat: number, pulse: number) => any) {
    this.onPulse = callback;
  }

  setBpm(bpm: number) {
    Tone.Transport.bpm.value = bpm;
  }

  start() {
    this.paused = false;
    Tone.Transport.start();
  }

  stop(shouldDestroy: boolean = false) {
    this.paused = true;
    this.measure = 0;
    this.beat = 0;
    Tone.Transport.stop();
    if (shouldDestroy) {
      this.quarterLoop.dispose();
      this.pulsesPart && this.pulsesPart.dispose();
      this.onTopId !== undefined && Tone.Transport.clear(this.onTopId);
      this.onPulse = undefined;
    }
  }

  count() {
    return this.beat || this.beatsPerMeasure[this.measure - 1];
  }

  current(beat: number) {
    return !this.paused && beat === this.beatIndex && this.quarterLoop.progress < livePlayWithin;
  }

  progress() {
    return Tone.Transport.progress;
  }

  transportPosition() {
    return Tone.Transport.position.replace(/\:[.\d]+$/, '');
  }

  canLivePlay(beatIndex) {
    return beatIndex === this.beatIndex && this.quarterLoop.progress < livePlayWithin;
  }
}

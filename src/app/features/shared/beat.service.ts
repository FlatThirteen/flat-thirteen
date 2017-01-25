import { Injectable } from '@angular/core';

import * as _ from 'lodash';
import * as Tone from 'tone';

import {Sound, ClickSound, Variation} from "./sounds/sound";

const loopTimes = {
  1: '4n',
  2: '8n',
  3: '8t',
  4: '16n'
};

const livePlayWithin: number = 0.3;

@Injectable()
export class BeatService {
  loop: Tone.Loop;

  beatsPerMeasure: number[];
  pulsesPerBeat: number;

  numBeats: number;

  measure: number = 0;
  beat: number = 0;
  pulse: number = 0;
  beatIndex: number = 0;

  onTopId: number;
  onPulse: (time: number, measure: number, beat: number, pulse: number) => any;

  clickSound: Sound = new ClickSound();

  paused: boolean = true;

  reset(beatsPerMeasure: number[] = [4],
        pulsesPerBeat: number = 1) {
    this.beatsPerMeasure = beatsPerMeasure;
    this.pulsesPerBeat = pulsesPerBeat;

    this.numBeats = _.reduce(beatsPerMeasure, (sum: number, n: number) => sum + n);

    this.measure = 0;
    this.beat = 0;
    this.pulse = 0;

    Tone.Transport.loop = true;
    Tone.Transport.setLoopPoints(0, beatsPerMeasure.length + 'm');

    let loopTime = loopTimes[pulsesPerBeat];
    if (!loopTime) {
      throw new Error('invalid pulsesPerBeat ' + pulsesPerBeat);
    }
    this.loop = new Tone.Loop((time: number) => {
      let variation = this.pulse ? Variation.Light : this.beat ? Variation.Normal : Variation.Heavy;
      this.clickSound.play(time, variation);

      if (this.onPulse) {
        this.onPulse(time, this.measure, this.beat, this.pulse);
      }
      this.pulse++;
      if (this.pulse === pulsesPerBeat) {
        this.pulse = 0;
        this.beat++;
        this.beatIndex++;
        if (this.beat === beatsPerMeasure[this.measure]) {
          this.beat = 0;
          this.measure++;
        }
      }

    }, loopTime);
    this.loop.start(0);
  }

  setOnTop(callback: (time: number) => any) {
    if (this.onTopId !== undefined) {
      Tone.Transport.clear(this.onTopId);
    }
    this.onTopId = Tone.Transport.schedule((time) => {
      this.measure = 0;
      this.beatIndex = 0;
      return callback(time);
    }, 0);
  }

  setOnPulse(callback: (time: number, measure: number, beat: number, pulse: number) => any) {
    this.onPulse = callback;
  }

  setBpm(bpm: number) {
    Tone.Transport.bpm.value = bpm;
  }

  start() {
    this.paused = false;
    Tone.Transport.start();
  }

  stop(shouldDestroy: boolean) {
    this.paused = true;
    Tone.Transport.stop();
    if (shouldDestroy) {
      this.loop.dispose();
      if (this.onTopId !== undefined) {
        Tone.Transport.clear(this.onTopId);
      }
      this.onPulse = undefined;
    }
  }

  count() {
    return this.beat || this.beatsPerMeasure[this.measure - 1];
  }

  progress() {
    return Tone.Transport.progress;
  }

  transportPosition() {
    return Tone.Transport.position.replace(/\:[.\d]+$/, '');
  }

  canLivePlay(beatIndex) {
    if (beatIndex !== this.beatIndex - 1) {
      return false;
    }
    return this.loop.progress < livePlayWithin;
  }
}

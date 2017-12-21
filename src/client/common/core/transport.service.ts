import * as _ from 'lodash';
import * as Tone from 'tone';

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { SoundService } from '../sound/sound.service';
import { ticksPerBeat, ticks } from './beat-tick.model';

const supportedPulses = [3, 4];
const livePlayWithin: number = 0.3;

export class Pulse {
  time: number;
  beat: number;
  nextBeat: number;
  tick: number;
}

@Injectable()
export class TransportService {
  quarterLoop: Tone.Loop;
  pulsesPart: Tone.Part;

  beatsPerMeasure: number[];
  numBeats: number;
  supportedTicks: number[];

  paused$: Subject<boolean> = new Subject();
  pulse$: Subject<Pulse> = new Subject();
  lastBeat$: Subject<boolean> = new Subject();

  measure: number = 0;
  beat: number = 0;
  beatIndex: number = 0;

  onTopId: number;
  onPulse: (time: number, beat: number, pulse: number) => any;

  paused: boolean = true;

  constructor(private sound: SoundService) {}

  reset(beatsPerMeasure: number[] = [4]) {
    this.beatsPerMeasure = beatsPerMeasure;
    this.numBeats = _.sum(beatsPerMeasure);

    this.measure = 0;
    this.beat = 0;
    this.beatIndex = -1;

    Tone.Transport.loop = true;
    Tone.Transport.setLoopPoints(0, beatsPerMeasure.length + 'm');

    this.disposeLoops();

    this.quarterLoop = new Tone.Loop((time: number) => {
      if (this.paused) {
        return;
      }
      this.beatIndex++;
      this.sound.play('click', time, { variation: this.beat ? 'normal' : 'heavy' });

      this.pulse$.next({
        time: time,
        beat: this.beatIndex,
        nextBeat: this.nextBeat(),
        tick: 0
      });
      if (this.onPulse) {
        this.onPulse(time, this.beatIndex, 0);
      }
      this.lastBeat$.next(this.lastBeat());

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
    this.supportedTicks = <number[]>_.sortBy(_.values(tickEvents));
    this.pulsesPart = new Tone.Part((time: number, tick) => {
      this.pulse$.next({
        time: time,
        beat: this.beatIndex,
        nextBeat: this.nextBeat(),
        tick: tick
      });
      if (this.onPulse) {
        this.onPulse(time, this.beatIndex, tick);
      }
    }, _.toPairs(tickEvents));
    this.pulsesPart.loop = true;
    this.pulsesPart.loopEnd = '4n';
    this.pulsesPart.start(0);
  }

  setOnTop(callback: (first: boolean, time: number) => any) {
    if (this.onTopId !== undefined) {
      Tone.Transport.clear(this.onTopId);
    }
    this.onTopId = Tone.Transport.schedule((time) => {
      let first = this.measure == 0;
      this.measure = 0;
      this.beatIndex = -1;
      return callback(first, time);
    }, 0);
  }

  setOnPulse(callback: (time: number, beat: number, pulse: number) => any) {
    this.onPulse = callback;
  }

  set bpm(bpm: number) {
    Tone.Transport.bpm.value = bpm;
  }

  get bpm() {
    return Tone.Transport.bpm.value;
  }

  get started() {
    return Tone.Transport.state === 'started';
  }

  get starting() {
    return !this.paused && !this.started;
  }

  start() {
    this.paused = false;
    this.paused$.next(false);
    this.lastBeat$.next(false);
    if (!this.started) {
      Tone.Transport.start('+4n');
    }
  }

  stop(shouldDestroy: boolean = false) {
    this.paused = true;
    this.paused$.next(true);
    this.measure = 0;
    this.beat = 0;
    Tone.Transport.stop();
    if (shouldDestroy) {
      this.disposeLoops();
      this.onPulse = undefined;
      if (this.onTopId !== undefined) {
        Tone.Transport.clear(this.onTopId);
      }
    }
  }

  disposeLoops() {
    if (this.quarterLoop) {
      this.quarterLoop.dispose();
    }
    if (this.pulsesPart) {
      this.pulsesPart.dispose();
    }

  }

  count() {
    return this.beat || this.beatsPerMeasure[this.measure - 1];
  }

  counts() {
    return _.times(this.numBeats);
  }

  nextBeat() {
    return this.beatIndex === this.numBeats - 1 ? 0 : this.beatIndex + 1;
  }

  lastBeat() {
    return this.beatIndex === this.numBeats - 1;
  }

  progress() {
    return Tone.Transport.progress;
  }

  transportPosition() {
    return Tone.Transport.position.replace(/\:[.\d]+$/, '');
  }

  active(beat?: number, pulse: number = 0, pulses: number = 1) {
    let start = pulse / pulses;
    let end = beat !== undefined ? (pulse + 1) / pulses : 0.9;
    return this.started && (beat === this.beatIndex || beat === undefined) &&
      _.inRange(this.quarterLoop.progress, start, end);
  }

  canLivePlay(beatIndex: number, pulse: number = 0, pulses: number = 1) {
    if (beatIndex !== this.beatIndex) {
      return false;
    } else if (pulses !== 1) {
      let playedTick = ticks(pulse, pulses);
      let currentTick = this.quarterLoop.progress * ticksPerBeat;
      return playedTick < currentTick &&
          currentTick - playedTick < livePlayWithin * ticksPerBeat / pulses;
    } else {
      return this.quarterLoop.progress < livePlayWithin;
    }
  }

  liveTick(beatIndex?: number): number | null {
    if (_.isNumber(beatIndex) && this.supportedTicks.length === 0) {
      return beatIndex === this.beatIndex &&
          this.quarterLoop.progress < livePlayWithin ? 0 : null;
    }
    let tick = this.quarterLoop.progress * ticksPerBeat;
    let tickIndex = _.sortedIndex(this.supportedTicks, tick);
    let low = tickIndex ? this.supportedTicks[tickIndex - 1] : 0;
    let high = tickIndex !== this.supportedTicks.length ?
      this.supportedTicks[tickIndex] : ticksPerBeat;
    return tick - low < high - tick ? low : high !== ticksPerBeat ? high : null;
  }
}

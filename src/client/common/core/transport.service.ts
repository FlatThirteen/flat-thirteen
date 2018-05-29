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
  onTopId: number;

  beatsPerMeasure: number[];
  numBeats: number;
  supportedTicks: number[];

  paused$: Subject<boolean> = new Subject();
  top$: Subject<boolean> = new Subject();
  pulse$: Subject<Pulse> = new Subject();
  lastBeat$: Subject<boolean> = new Subject();

  paused: boolean = true;
  measure: number = 0;
  beat: number = 0;
  beatIndex: number = 0;
  startTime: number = 0;
  endTime: number = 0;

  latencyHistogram: number[] = [];

  constructor(private sound: SoundService) {}

  resume() {
    this.sound.resume();
  }

  get resumed() {
    return this.sound.resumed;
  }

  reset(beatsPerMeasure: number[] = [4]) {
    let restart = !this.paused;
    this.stop();

    this.beatsPerMeasure = beatsPerMeasure;
    this.numBeats = _.sum(beatsPerMeasure);

    this.measure = -1;
    this.beat = -1;
    this.beatIndex = -1;

    Tone.Transport.loop = true;
    Tone.Transport.setLoopPoints(0, this.loopTime());

    this.disposeLoops();

    this.quarterLoop = new Tone.Loop((time: number) => {
      if (this.paused) {
        return;
      }
      this.logIfLate(time);
      this.beatIndex++;
      this.beat++;
      if (this.beat >= this.countBeats) {
        this.beat = 0;
        this.measure++;
      }

      this.sound.play('click', time, { variation: this.beat ? 'normal' : 'heavy' });
      this.emitPulse(time, 0);

      this.lastBeat$.next(this.lastBeat());
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
      this.logIfLate(time);
      this.emitPulse(time, tick);
    }, _.toPairs(tickEvents));
    this.pulsesPart.loop = true;
    this.pulsesPart.loopEnd = '4n';
    this.pulsesPart.start(0);

    if (!this.onTopId) {
      this.onTopId = Tone.Transport.schedule(() => {
        let first = this.measure === -1;
        this.measure = 0;
        this.beat = -1;
        this.beatIndex = -1;
        this.top$.next(first);
      }, 0);
    }

    if (restart) {
      this.start();
    }
  }

  emitPulse(time: number, tick: number) {
    this.pulse$.next({
      time,
      beat: this.beatIndex,
      nextBeat: this.nextBeat(),
      tick
    });
  }

  logIfLate(time) {
    let start = this.currentTime;
    if (start <= time) {
      return;
    }
    let difference = Math.min(_.floor(10 * (start - time)), 10);
    if (!this.latencyHistogram[difference]) {
      this.latencyHistogram[difference] = 1;
    } else {
      this.latencyHistogram[difference]++;
    }
    console.log(this.elapsedTime() + 's Late: ', _.round(start - time, 5),
        this.latencyHistogram, time, this.latencyHint);
  }

  set latencyHint(latencyHint: string) {
    if (this.isValidLatencyHint(latencyHint)) {
      Tone.context['latencyHint'] = this.isNumericLatencyHint(latencyHint) ?
        _.toNumber(latencyHint) : latencyHint;
    }
  }

  get latencyHint() {
    return Tone.context['latencyHint'];
  }

  isValidLatencyHint(latencyHint: string) {
    return latencyHint === 'fastest' || latencyHint ===  'interactive' ||
      latencyHint === 'balanced' || latencyHint === 'playback' ||
      this.isNumericLatencyHint(latencyHint);
  }

  isNumericLatencyHint(latencyHint: string) {
    return _.inRange(_.toNumber(latencyHint), 0, 0.5);
  }

  set bpm(bpm: number) {
    if (this.isValidBpm(bpm)) {
      Tone.Transport.bpm.rampTo(bpm, 1);
      Tone.Transport.setLoopPoints(0, this.loopTime());
    }
  }

  get bpm() {
    return Tone.Transport.bpm.value;
  }

  isValidBpm(bpm: number) {
    return bpm >= 40 && bpm <= 300;
  }

  loopTime() {
    return (new Tone.Time('4n')).toSeconds() * this.numBeats;
  }

  get started() {
    return Tone.Transport.state === 'started';
  }

  get starting() {
    return !this.paused && !this.started;
  }

  start(time = '+4n') {
    this.latencyHistogram = [];
    this.paused = false;
    this.paused$.next(false);
    this.lastBeat$.next(false);
    if (!this.started) {
      Tone.Transport.start(time);
      this.startTime = this.currentTime;
      this.endTime = 0;
    }
  }

  stop(shouldDestroy: boolean = false) {
    this.endTime = this.currentTime;
    this.paused = true;
    this.paused$.next(true);
    this.beat = -1;
    this.measure = -1;
    Tone.Transport.stop();
    if (shouldDestroy) {
      this.disposeLoops();
    }
  }

  disposeLoops() {
    if (this.quarterLoop) {
      this.quarterLoop.dispose();
      delete this.quarterLoop;
    }
    if (this.pulsesPart) {
      this.pulsesPart.dispose();
      delete this.pulsesPart;
    }
  }

  elapsedTime() {
    if (this.startTime) {
      return _.round((this.endTime || this.currentTime) - this.startTime);
    }
  }

  get count() {
    return this.beat + 1 || '';
  }

  counts() {
    return _.times(this.numBeats);
  }

  get countBeats() {
    return this.beatsPerMeasure[this.measure];
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

  get currentTime() {
    return Tone.context['currentTime'];
  }
}

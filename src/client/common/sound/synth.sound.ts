import * as Tone from 'tone';

import { Params, Sound } from './sound';

export class SynthSound implements Sound {
  synth: Tone.PolySynth;

  constructor() {
    this.synth = <Tone.PolySynth>new Tone.PolySynth(6, Tone.Synth, {
      oscillator: {
        type: 'fatsawtooth',
        count: 3,
        spread: 30
      },
      envelope: {
        attack: 0.01,
        decay: 0.1,
        sustain: 0.5,
        release: 0.4,
        attackCurve: 'exponential'
      }
    }).toMaster();
  }

  play(time?: any, params: Params = {pitch: 'A4', duration: '4n'}) {
    this.synth.triggerAttackRelease(params.pitch, params.duration, time);
  }

  attack(params: Params = {pitch: 'A4'}) {
    this.synth.triggerAttack(params.pitch, params.time);
  }

  release(params: Params = {pitch: 'A4'}) {
    this.synth.triggerRelease(params.pitch, params.time);
  }

  releaseAll() {
    this.synth.releaseAll(null);
  }
}

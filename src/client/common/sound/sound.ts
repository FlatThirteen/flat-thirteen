import * as Tone from 'tone';

export type Variation = 'normal' | 'light' | 'heavy';

export interface Params {
  variation?: Variation;
  pitch?: string;
  duration?: string,
  time?: any;
}

export interface Sound {
  play(time?: any, params?: Params): any;
  attack?(time?: any, params?: Params): any;
  release?(time?: any, params?: Params): any;
  releaseAll?(): any;
}

const membraneEnvelopeOptions = {
  attack: 0.001,
  decay: 0.1,
  sustain: 0
};

export class KickSound implements Sound {
  kick: Tone.MembraneSynth;

  constructor() {
    this.kick = new Tone.MembraneSynth({
      pitchDecay: 0.02,
      oscillator: { type: 'square4' },
      envelope: membraneEnvelopeOptions,
      volume: 10
    });
    let chorus = new Tone.Chorus(4, 3, 1);
    this.kick.chain(chorus, Tone.Master);
  }

  play(time?: any) {
    this.kick.triggerAttackRelease('A0', '4n', time, 1);
  }
}

export class SnareSound implements Sound {
  hit: Tone.MembraneSynth;
  rattle: Tone.NoiseSynth;

  constructor() {
    this.hit = new Tone.MembraneSynth({
      pitchDecay: 0.01,
      envelope: membraneEnvelopeOptions,
      volume: 10
    });
    let hitEffect = new Tone.Distortion(0.1).toMaster();
    this.hit.chain(hitEffect, Tone.Master);
    this.rattle = new Tone.NoiseSynth({
      type: 'brown',
      envelope: {
        attack: 0.01,
        decay: 0.001,
        sustain: 0.001,
        release: 0.05
      },
      volume: -10
    });
    let snareEffect = new Tone.BitCrusher(1).toMaster();
    this.rattle.chain(snareEffect, Tone.Master);
  }

  play(time?: any) {
    this.hit.triggerAttackRelease('A4', '16n', time);
    this.rattle.triggerAttackRelease('16n', time);
  }
}

export class ClickSound implements Sound {
  click: Tone.MembraneSynth;

  constructor() {
    this.click = new Tone.MembraneSynth({
      pitchDecay: 0.01,
      octaves: 6,
      oscillator: { type: 'square4' },
      envelope: membraneEnvelopeOptions,
      volume: -20
    });
    this.click.connect(Tone.Master);
  }

  play(time?: any, params: Params = {variation: 'normal'}) {
    switch (params.variation) {
      case 'heavy':
        this.click.triggerAttackRelease('A6', '16n', time);
        break;
      case 'light':
        this.click.triggerAttackRelease('A5', '16n', time, 0.5);
        break;
      default:
        this.click.triggerAttackRelease('A5', '16n', time);
    }
  }
}

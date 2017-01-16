import * as Tone from 'tone';

export interface Instrument {
  play(): any;
}

export class KickInstrument implements Instrument {
  kick: Tone.MembraneSynth;

  constructor() {
    this.kick = new Tone.MembraneSynth();
    this.kick.pitchDecay = .02;
    let chorus = new Tone.Chorus(4, 3, 1);
    let volume = new Tone.Volume(6);
    this.kick.chain(chorus, volume, Tone.Master);
  }

  play() {
    this.kick.triggerAttackRelease('A0', '4n');
  }
}

export class SnareInstrument implements Instrument {
  hit: Tone.MembraneSynth;
  rattle: Tone.NoiseSynth;

  constructor() {
    this.hit = new Tone.MembraneSynth();
    let hitEffect = new Tone.Distortion(0.1).toMaster();
    this.hit.chain(hitEffect, Tone.Master);
    this.rattle = new Tone.NoiseSynth({type: 'white'});
    let snareEffect = new Tone.BitCrusher(1).toMaster();
    this.rattle.chain(snareEffect, Tone.Master);
  }

  play() {
    this.hit.triggerAttackRelease('A1', '16n');
    this.rattle.triggerAttackRelease('4n');
  }
}

import * as _ from 'lodash';
import * as Tone from 'tone';

export const ticksPerBeat = Tone.Transport.PPQ; // 192

export type BeatTick = string; // 'b:ttt', e.g. '0:048', '3:096'

export function beatTickFrom(beat: number, tick: number = 0): BeatTick {
  return beat + ':' + _.padStart(tick.toString(), 3, '0');
}

export function ticks(pulse: number, pulses: number) {
  return pulse * ticksPerBeat / pulses;
}

export function pulseFrom(tick, pulses: number) {
  return tick * pulses / ticksPerBeat;
}

export function duration(pulses: number) {
  return {
    1: '4n',
    2: '8n',
    3: '8t',
    4: '16n'
  }[pulses];
}

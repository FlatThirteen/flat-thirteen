import * as _ from 'lodash';

import { ticks } from "./transport.service";

export type BeatTick = string; // 'b:ttt', e.g. '0:048', '3:096'

export function mapKey(beat: number, tick: number): BeatTick {
  return beat + ':' + _.padStart(tick.toString(), 3, '0');
}

export class Rhythm {
  private readonly map: _.Dictionary<number>;
  readonly pulseProbabilities: [BeatTick, number][];
  readonly pulsesByBeat: number[];
  readonly supportedPulses: number[];
  readonly length: number;

  constructor(private readonly timing: _.List<number | number[]>) {
    this.map = _.reduce(timing, (result, probability: number | number[], beat: number) => {
      if (_.isNumber(probability)) {
        result[mapKey(beat, 0)] = probability;
      } else {
        let pulses = probability.length;
        _.each(probability, (probability: number, pulse: number) => {
          result[mapKey(beat, ticks(pulse, pulses))] = probability;
        })
      }
      return result;
    }, {});
    this.pulseProbabilities = <[BeatTick, number][]>_.orderBy(_.toPairs(this.map), 1, 'desc');
    this.pulsesByBeat = <number[]>_.map(timing, (timing) => _.isArray(timing) ? timing.length : 1);
    this.supportedPulses = _.sortBy(_.uniq(this.pulsesByBeat));
    this.length = _.flatten(timing).length;
  }
}

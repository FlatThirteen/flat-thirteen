import * as _ from 'lodash';

import { BeatTick, ticks, beatTickFrom } from './beat-tick.model';

export class Rhythm {
  private readonly map: _.Dictionary<number>;
  readonly pulseProbabilities: [BeatTick, number][];
  readonly pulsesByBeat: number[];
  readonly supportedPulses: number[];
  readonly length: number;

  constructor(private readonly timings: _.List<number | number[]>) {
    this.map = _.reduce(timings, (result, probabilities: number | number[], beat: number) => {
      if (_.isNumber(probabilities)) {
        result[beatTickFrom(beat, 0)] = probabilities;
      } else {
        let pulses = probabilities.length;
        _.each(probabilities, (probability: number, pulse: number) => {
          result[beatTickFrom(beat, ticks(pulse, pulses))] = probability;
        });
      }
      return result;
    }, {});
    this.pulseProbabilities = <[BeatTick, number][]>_.orderBy(_.toPairs(this.map), 1, 'desc');
    this.pulsesByBeat = <number[]>_.map(timings, (timing) => _.isArray(timing) ? timing.length : 1);
    this.supportedPulses = _.sortBy(_.uniq(this.pulsesByBeat));
    this.length = _.flatten(timings).length;
  }

  static fromParam(param: string): Rhythm {
    let pulses = _.map(param, _.parseInt).map(_.partial(_.clamp, _, 1, 4));
    return Rhythm.fromPulses(pulses);
  }

  static fromPulses(pulses: number[]): Rhythm {
    let timing = _.map(pulses, (pulse) => _.times(pulse, _.constant(0)));
    timing[0][0] = 1;
    return new Rhythm(timing);
  }
}

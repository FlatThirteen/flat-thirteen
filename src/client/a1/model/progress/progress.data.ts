import * as _ from 'lodash';

import { Powers, PowerType, PowerUp } from '../../../common/core/powers.service';

const max = {
  strip: 1,
  auto: 3,
  backing: 1
};

export class ProgressData {
  static max(powerUps: string) {
    return max[powerUps];
  }

  static powerUps(powers: Powers, lesson: number, points: number): PowerType[] {
    let result = [];
    if (powers.level('strip') < max['strip']) {
      result.push(new PowerUp('strip'));
    }
    if (powers.level('auto') < max['auto'] && (points >= 400 || lesson > 1)) {
      result.push(new PowerUp('auto'));
    }
    if (powers.level('backing') < max['backing'] && powers.level('auto') === max['auto']) {
      result.push(new PowerUp('backing'));
    }
    if (powers.level('strip') === max['strip'] && powers.level('auto') === max['auto']) {
      let maxPulses = _.map(['pulse1', 'pulse2', 'pulse3', 'pulse4'],
          (type: PowerType) => powers.level(type));
      let min = _.min(maxPulses);
      let indexes = _.reduce(maxPulses, (result, value, index) => {
        if (value === min) {
          result.push(index + 1)
        }
        return result;
      }, []);
      result.push(new PowerUp('pulse', indexes));
    }
    return result;
  }
}

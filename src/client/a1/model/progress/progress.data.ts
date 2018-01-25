import { Powers } from '../../../common/core/powers.service';

const max = {
  strip: 1,
  auto: 4
};

export class ProgressData {
  static max(powerUps: number) {
    return max[powerUps];
  }

  static powerUps(powers: Powers, lesson: number, points: number) {
    let result = [];
    if (powers.level('strip') < max['strip']) {
      result.push('strip');
    }
    if (powers.level('auto') < max['auto'] && (points >= 400 || lesson > 1)) {
      result.push('auto');
    }
    return result;
  }
}

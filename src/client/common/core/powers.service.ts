import * as _ from 'lodash';

import { Injectable } from '@angular/core';
import { Params } from '@angular/router';

import { SoundService } from '../sound/sound.service';
import { ProgressData } from '../../a1/model/progress/progress.data';

export type PowerType = 'strip' | 'pulse' | 'auto';

export class Powers {
  public readonly levels: _.Dictionary<number>;
  public readonly any: boolean;

  constructor(levels: _.Dictionary<number> = {}) {
    this.levels = _.clone(levels);
    this.any = !!_.findKey(levels);
  }

  up(powerType: PowerType) {
    if (this.levels[powerType]) {
      return new Powers(_.mapValues(this.levels, (value, key) => {
        return key === powerType ? value + 1 : value;
      }));
    } else {
      return new Powers(_.defaults(_.fromPairs([[powerType, 1]]), this.levels));
    }
  }

  level(powerType: PowerType) {
    return this.levels[powerType] || 0;
  }
}

@Injectable()
export class PowersService {
  public setting: _.Dictionary<number> = {};
  public highlights: _.Dictionary<boolean> = {};

  constructor(private sound: SoundService) {}

  init(params: Params) {
    this.setting = {
      strip: _toLevel(params['strip'], ProgressData.max('strip')),
      auto:  _toLevel(params['auto'], ProgressData.max('auto'))
    };
  }

  highlight(powerType: PowerType) {
    this.highlights[powerType] = true;
  }

  set(powerType: PowerType, level?: number) {
    this.highlights[powerType] = false;
    if (_.isNumber(level)) {
      let down = level < (this.setting[powerType] || 0);
      if (this.setting[powerType] !== level) {
        this.setting[powerType] = level;
        this.sound.playSequence('cowbell', ['E7', down ? 'A6' : 'A7'], '16n');
      } else {
        this.sound.playSequence('cowbell', ['E7'], '16n');
      }
    }
  }

  highlighted(powerType: PowerType) {
    return this.highlights[powerType];
  }

  unhighlight() {
    this.highlights = {};
  }

  current(): Powers {
    return new Powers(this.setting);
  }

  level(powerType: PowerType) {
    return this.setting[powerType];
  }

  get autoPlay() {
    return this.setting['auto'] > 0;
  }

  get autoGoal() {
    return this.setting['auto'] > 1;
  }

  get autoNext() {
    return this.setting['auto'] > 2;
  }

  get autoLoop() {
    return this.setting['auto'] > 3;
  }
}

function _toLevel(param: string, max: number): number {
  let level = _.toNumber(param);
  return param === 'true' || level > max ? max : level || 0;
}

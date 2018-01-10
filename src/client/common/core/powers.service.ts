import * as _ from 'lodash';

import { Injectable } from '@angular/core';
import { Params } from '@angular/router';

import { SoundService } from '../sound/sound.service';

export interface PowerProperties {
  autoPlay?: boolean,
  autoGoal?: boolean,
  autoNext?: boolean,
  autoLoop?: boolean
}

export class Powers implements PowerProperties {
  public readonly autoPlay: boolean;
  public readonly autoGoal: boolean;
  public readonly autoNext: boolean;
  public readonly autoLoop: boolean;
  public readonly any: boolean;

  constructor(properties: PowerProperties = {}) {
    this.autoPlay = properties.autoPlay;
    this.autoGoal = properties.autoGoal;
    this.autoNext = properties.autoNext;
    this.autoLoop = properties.autoLoop;
    this.any = properties.autoPlay || properties.autoGoal ||
        properties.autoNext || properties.autoLoop;
  }

  anyNew(toggled: PowerProperties): boolean {
    return this.autoPlay && !toggled.autoPlay || this.autoGoal && !toggled.autoGoal ||
        this.autoNext && !toggled.autoNext || this.autoLoop && !toggled.autoLoop;
  }

  static update(powers: Powers, lesson: number, points: number): Powers {
    return new Powers({
      autoPlay: powers.autoPlay || lesson > 1 || points >= 400,
      autoGoal: powers.autoGoal || lesson > 2 || points >= 800,
      autoNext: powers.autoNext || lesson > 3 || points >= 1200,
      autoLoop: powers.autoLoop || lesson > 4 || points >= 1600,
    });
  }
}

@Injectable()
export class PowersService {
  private allowed: Powers;
  public enabled: PowerProperties;
  public toggled: PowerProperties;
  private _anyNew: boolean;

  constructor(private sound: SoundService) {}

  init(params: Params) {
    this.enabled = {
      autoPlay: params['play'] === 'auto' || !!params['auto'],
      autoGoal: params['goal'] === 'auto' || !!params['auto'],
      autoNext: params['next'] === 'auto' || !!params['auto'],
      autoLoop: params['loop'] === 'auto' || !!params['auto']
    };
    this.toggled = _.clone(this.enabled);
    this._anyNew = false;
  }

  update(powers: Powers) {
    this.allowed = powers;
    this._anyNew = this.toggled ? powers.anyNew(this.toggled) : false;
  }

  toggle(property: keyof PowerProperties) {
    this.enabled[property] = !this.enabled[property];
    this.toggled[property] = true;
    this._anyNew = this.allowed.anyNew(this.toggled);
    this.sound.playSequence('cowbell',
        ['E7', this.enabled[property] ? 'A7' : 'A6'], '16n');
  }

  current(): Powers {
    return new Powers(this.enabled);
  }

  get anyNew(): boolean {
    return this._anyNew;
  }
}

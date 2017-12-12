import * as _ from 'lodash';

import { Injectable } from '@angular/core';
import { Params } from '@angular/router';

export interface PowerProperties {
  autoPlay?: boolean
}

export class Powers implements PowerProperties {
  public readonly autoPlay: boolean;
  public readonly any: boolean;

  constructor(properties: PowerProperties = {}) {
    this.autoPlay = properties.autoPlay;
    this.any = properties.autoPlay;
  }

  anyNew(toggled: PowerProperties): boolean {
    return this.autoPlay && !toggled.autoPlay;
  }

  static update(powers: Powers, lesson: number, points: number): Powers {
    return new Powers({
      autoPlay: powers.autoPlay || lesson > 1 || points >= 400
    });
  }
}

@Injectable()
export class PowersService {
  private allowed: Powers;
  public enabled: PowerProperties;
  public toggled: PowerProperties;
  private _anyNew: boolean;

  constructor() {}

  init(params: Params) {
    this.enabled = {
      autoPlay: !!params['auto']
    };
    this.toggled = _.clone(this.enabled);
    this._anyNew = false;
  }

  update(powers: Powers) {
    this.allowed = powers;
    this._anyNew = powers.anyNew(this.toggled);
  }

  toggle(property: keyof PowerProperties) {
    this.enabled[property] = !this.enabled[property];
    this.toggled[property] = true;
    this._anyNew = this.allowed.anyNew(this.toggled);
  }

  current(): Powers {
    return new Powers(this.enabled);
  }

  get anyNew(): boolean {
    return this._anyNew;
  }
}

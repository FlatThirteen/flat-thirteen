import * as _ from 'lodash';

import { Injectable } from '@angular/core';

import { SoundName } from "../sound/sound";
import { Surface } from "./surface.model";

@Injectable()
export class SurfaceService {
  private surfaces: Surface[];

  private _soundNames: SoundName[];
  private _initialData: _.Dictionary<Surface.Data>;

  init(surfaces: Surface[]) {
    this.surfaces = surfaces;
    this._soundNames = <SoundName[]>_.flatten(_.map(this.surfaces, 'soundNames'));
    this._initialData = _.reduce(surfaces, (result, surface) => {
      return _.set(result, surface.id, surface.initialData);
    }, {});
  }

  forKey(key: string) {
    return key ? _.find(this.surfaces, (surface: Surface) => surface.listens(key)) : null;
  }

  get soundNames() {
    return this._soundNames;
  }

  get initialData() {
    return this._initialData;
  }
}

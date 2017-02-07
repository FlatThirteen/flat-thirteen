import * as _ from 'lodash';

import { Injectable } from '@angular/core';

import { SoundName } from "./sound/sound";
import { Surface } from "./surface";

@Injectable()
export class SurfaceService {
  private surfaces: Surface[];

  private _soundNames: SoundName[];
  private _keysByBeat: string[][];
  private keyMap: _.Dictionary<Surface.Info>;
  private _initialData: _.Dictionary<Surface.Data>;

  init(surfaces: Surface[]) {
    this.surfaces = surfaces;
    this._soundNames = <SoundName[]>_.flatten(_.map(this.surfaces, 'soundNames'));
    this._keysByBeat = _.times(4, beat => {
      return <string[]>_.flatten(_.map(this.surfaces, _.method('keysAt', beat)));
    });
    this.keyMap = _.reduce(surfaces, (result, surface) => {
      return _.merge(result, surface.infoByKey);
    }, {});
    this._initialData = _.reduce(surfaces, (result, surface) => {
      return _.merge(result, surface.initialData);
    }, {});
  }

  forKey(key: string) {
    return key ? _.find(this.surfaces, (surface: Surface) => surface.listens(key)) : null;
  }

  get soundNames() {
    return this._soundNames;
  }

  get keysByBeat() {
    return this._keysByBeat;
  }

  get initialData() {
    return this._initialData;
  }
}

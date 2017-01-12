import {Instrument} from "../instruments/instrument";

export class Grid {
  numStrips: number;
  numBeats: number;
  instruments: Instrument[];
  gridState: number[][];
  goalState: number[][];
  playedState: number[][];
  numGoalNotes: number;

  constructor(instruments: Instrument[], numBeats: number) {
    this.numStrips = instruments.length;
    this.numBeats = numBeats;
    this.instruments = instruments;

    this.clearGrid();
    this.clearPlayed();
    this.newGoal(4);
  }

  clearGrid() {
    this.gridState = [];
    for (let i = 0; i < this.numStrips; i++) {
      let strip: number[] = [];
      for (let j = 0; j < this.numBeats; j++) {
        strip.push(0);
      }
      this.gridState.push(strip);
    }
  }

  clearPlayed() {
    this.playedState = [];
    for (let i = 0; i < this.numStrips; i++) {
      this.playedState.push([]);
    }
  }

  newGoal(maxNotes: number) {
    this.numGoalNotes = 0;
    this.goalState = [];
    for (let i = 0; i < this.numStrips; i++) {
      let strip: number[] = [];
      for (let j = 0; j < this.numBeats; j++) {
        let value = Grid.randomInt(1);
        strip.push(value);
        if (value) {
          this.numGoalNotes++;
        }
      }
      this.goalState.push(strip);
    }
  }

  playGoal(beatIndex: number) {
    for(let i = 0; i < this.numStrips; i++) {
      if (this.goalState[i][beatIndex]) {
        this.instruments[i].play();
      }
    }
  }

  playBeat(beatIndex: number) {
    for(let i = 0; i < this.numStrips; i++) {
      if (this.gridState[i][beatIndex]) {
        this.instruments[i].play();
        this.playedState[i].push(1);
      } else {
        this.playedState[i].push(0);
      }
    }
  }

  toggle(stripIndex: number, beatIndex: number, canPlaySound: () => boolean) {
    this.gridState[stripIndex][beatIndex] =
      this.gridState[stripIndex][beatIndex] ? 0 : 1;
    if (this.gridState[stripIndex][beatIndex] && canPlaySound()) {
      this.instruments[stripIndex].play();
      this.playedState[stripIndex][beatIndex] = 1;
    } else if (!this.gridState[stripIndex][beatIndex]) {
      this.playedState[stripIndex][beatIndex] = 0;
    }
  }

  reachedGoal() {
    for (let i = 0; i < this.numStrips; i++) {
      for (let j = 0; j < this.numBeats; j++) {
        if (this.playedState[i][j] != this.goalState[i][j]) {
          this.clearPlayed();
          return false;
        }
      }
    }
    this.clearPlayed();
    return true;
  }

  static randomInt(upTo: number) {
    return Math.floor(Math.random() * (upTo + 1));
  }
}

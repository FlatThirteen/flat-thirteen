import { Injectable } from '@angular/core';

export enum State {
  Demo,
  Count,
  Goal,
  Play,
  Victory
}

@Injectable()
export class StageService {
  private state: State = State.Demo;
  private nextState: State = State.Count;
  private round: number = 0;
  private active: boolean = false;
  private inactiveRounds: number = 0;

  reset() {
    this.state = State.Demo;
    this.nextState = State.Count;
    this.round = 0;
    this.active = false;
    this.inactiveRounds = 0;
  }

  setActive() {
    this.active = true;
  }

  nextRound(playedGoal: boolean = false) {
    if (playedGoal) {
      this.nextState = State.Victory;
    } else {
      if (this.active) {
        this.inactiveRounds = 0;
      } else if (this.inactiveRounds >= 3) {
        this.nextState = State.Goal;
      }
    }

    this.state = this.nextState;
    this.active = false;
    switch(this.state) {
      case State.Count:
      case State.Victory:
        this.nextState = State.Goal;
        this.round = 0;

        break;
      case State.Goal:
        this.nextState = State.Play;
        this.inactiveRounds = 0;
        break;
      case State.Play:
        this.round++;
        if (!this.active) {
          this.inactiveRounds++;
        } else {
          this.inactiveRounds = 0;
        }
    }
  }

  getRound() {
    return this.round;
  }

  stateName() {
    return State[this.state];
  }

  isDemo() {
    return this.state === State.Demo;
  }

  isGoal() {
    return this.state === State.Goal;
  }

  isPlay() {
    return this.state === State.Play;
  }

  shouldShowCount() {
    return this.state === State.Count || this.state === State.Victory;
  }

  shouldShowPosition() {
    return this.state === State.Goal || this.state === State.Play;
  }

}

export class Penalty {
  constructor(readonly max: number, readonly current = 0, readonly difference = 0) {}

  accrue(amount: number) {
    let newAmount = Math.min(this.current + amount, this.max);
    return new Penalty(this.max, newAmount, newAmount - this.current);
  }
}

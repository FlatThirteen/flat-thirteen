import { PhraseBuilder, Phrase } from './phrase.model';
import { Note } from '../sound/sound';
import { ticks } from '../core/beat-tick.model';

const hiNote = new Note('cowbell', {pitch: 'A5'});
const loNote = new Note('cowbell', {pitch: 'E5'});

const tick1 = ticks(1, 4);
const tick2 = ticks(2, 4);
const tick3 = ticks(3, 4);

export class VictoryPhraseBuilder implements PhraseBuilder {


  constructor(private notes: number) {}

  build(): Phrase {
    let phrase = new Phrase();
    switch(this.notes) {
      case 10:
        phrase.add(loNote, 1, tick3);
        // falls through
      case 9:
        phrase.add(hiNote, 0, tick3);
        // falls through
      case 8:
        phrase.add(hiNote, 1, tick1);
        // falls through
      case 7:
        phrase.add(hiNote, 2, tick2);
        // falls through
      case 6:
        phrase.add(hiNote, 0, tick2);
        // falls through
      case 5:
        phrase.add(loNote, 1, 0);
        // falls through
      case 4:
        phrase.add(loNote, 2, tick3);
        // falls through
      case 3:
        phrase.add(hiNote, 0, 0);
        // falls through
      default:
        phrase.add(loNote, 1, tick2);
        phrase.add(hiNote, 2, 0);
    }
    return phrase;
  }
}

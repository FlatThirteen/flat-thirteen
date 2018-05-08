import * as _ from 'lodash';
import * as Tone from 'tone';

import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';

import { beatTickFrom } from '../core/beat-tick.model';
import { Note } from '../core/note.model';
import { Phrase } from '../phrase/phrase.model';
import { SoundService } from '../sound/sound.service';

@Injectable()
export class BackingService {
  phrase: Phrase;
  debugPhrase: string[];
  now: string;
  fixedNotes: string[] = [];

  public notes$: Subject<Note[]> = new Subject();
  public notesOff$: Subject<String[]> = new Subject();

  constructor(private sound: SoundService) {}

  setPhrase(phrase) {
    this.phrase = phrase;
    this.debugPhrase = phrase.toArray();
  }

  setFixed(notes: string[], playNotes = false) {
    this.notesOff$.next(this.fixedNotes);
    this.fixedNotes = notes;
    let actualNotes = _.map(notes, (note) => Note.from(note));
    this.notes$.next(actualNotes);
    if (playNotes) {
      _.forEach(actualNotes, (note) => {
        note.params.duration = '8n';
        this.sound.play(note.soundName, '+0', note.params);
      });
    }
  }

  pulse(time: number, beat: number, tick: number) {
    let notes = this.phrase.getNotes(beat, tick);
    _.forEach(notes, (note) => {
      this.now = beatTickFrom(beat, tick);
      this.sound.play(note.soundName, time, note.params);
      Tone.Draw.schedule(() => {
        if (!_.includes(this.fixedNotes, note.toString())) {
          this.notesOff$.next([note.toString()]);
        }
      }, time + note.duration);
    });
    if (notes.length) {
      Tone.Draw.schedule(() => {
        this.notes$.next(_.filter(notes, (note) => !_.includes(this.fixedNotes, note.toString())));
      }, time);
    }
  }
}

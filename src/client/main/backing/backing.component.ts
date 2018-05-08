import * as _ from 'lodash';

import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';

import { BackingService } from '../../common/backing/backing.service';
import { duration, ticks } from '../../common/core/beat-tick.model';
import { Note, SoundName } from '../../common/core/note.model';
import { TransportService } from '../../common/core/transport.service';
import { Phrase } from '../../common/phrase/phrase.model';
import { SoundService } from '../../common/sound/sound.service';

let requestAnimationFrameId: number;

interface Track {
  type: string,
  notes: string,
  solo?: boolean,
  mute?: boolean
}

@Component({
  selector: 'backing-page',
  templateUrl: 'backing.component.pug',
  styleUrls: ['backing.component.styl'],
})

export class BackingComponent implements OnInit, OnDestroy {
  tracks: Track[] = [
    { type: 'synth', notes: 'C2,C2 G1,G1 Bb1,Bb1 B1,B1' },
    { type: 'synth', notes: 'G4.C5.Eb5, ,G4.C5.Eb5  G4.C5.F5' },
    { type: 'drums', notes: 'K ,K S,K ,K' }
  ];
  selectedBeat: string;

  anySolo: boolean;

  constructor(private backing: BackingService, private transport: TransportService) {}

  ngOnInit() {
    console.log('Starting draw! ' + (requestAnimationFrameId || ''));
    this.transport.reset([4]);
    this.transport.setOnPulse((time, beat, tick) => this.backing.pulse(time, beat, tick));
    this.parseNotes();
    function draw() {
      requestAnimationFrameId = requestAnimationFrame(draw);
    }
    draw();
  }

  ngOnDestroy() {
    console.log('Stopping draw!');
    window.cancelAnimationFrame(requestAnimationFrameId);
    this.transport.stop(true);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onPlay();
    }
  }

  onPlay() {
    if (this.transport.started) {
      console.log('Stop');
      this.transport.stop();
    } else {
      console.log('Start');
      this.transport.start('+0');
    }
  }

  onAdd($event, type?: string) {
    if (type) {
      this.tracks.push({ type: type, notes: $event.target.innerText });
      this.parseNotes();
    } else {
      this.tracks.push({ type: 'synth', notes: ''});
    }
  }

  onRemove(index: number) {
    this.tracks.splice(index, 1);
    this.parseNotes();
  }

  isNow(beatDebug: string) {
    return _.startsWith(beatDebug, this.backing.now);
  }

  onBeat(beatDebug: string) {
    if (this.selectedBeat !== beatDebug) {
      this.selectedBeat = beatDebug;
      this.backing.setFixed(_.split(_.split(beatDebug, ': ')[1], ','), this.transport.paused);
    } else {
      this.selectedBeat = null;
      this.backing.setFixed([]);
    }
  }

  parseNotes() {
    let phrase = new Phrase();
    let solo = false;
    _.forEach(this.tracks, (track) => {
      if (!solo && track.solo) {
        phrase = new Phrase();
        solo = true;
      }
      if (parser[track.type] && track.notes && !track.mute && (!solo || track.solo)) {
        _.forEach(track.notes.split(' '), (beatNote, beatIndex) => {
          _.forEach(beatNote.split(','), (pulseNote, pulseIndex, array) => {
            let pulses = array.length;
            _.forEach(pulseNote.split('.'), (chordNote) => {
              try {
                let note = parser[track.type](chordNote, duration(pulses));
                if (note) {
                  phrase.add(note, beatIndex, ticks(pulseIndex, pulses));
                }
              } catch(error) {
                console.log('Parse error:', error);
              }
            });
          });
        });
      }
    });

    this.backing.setFixed([]);
    this.backing.setPhrase(phrase);
    this.selectedBeat = null;
    this.anySolo = solo;
  }
}

const parser = {
  synth: (data, duration) => {
    let frequency = Note.pitch(data);
    if (frequency) {
      return new Note('synth', {
        pitch: frequency.toNote(),
        duration: duration
      });
    }
  },
  drums: (data) => {
    let sound: SoundName = data.match(/[kK]/) ? 'kick' :
      data.match(/[sS]/) ? 'snare' : null;
    if (sound) {
      return new Note(sound);
    }
  },
  cowbell: (data) => {
    let frequency = Note.pitch(data);
    if (frequency) {
      return new Note('cowbell', { pitch: frequency.toNote() });
    }
  }
};

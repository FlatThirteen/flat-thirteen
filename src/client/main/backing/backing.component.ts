import * as _ from 'lodash';

import { Component, HostListener, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';

import { beatTickFrom, duration, ticks } from '../../common/core/beat-tick.model';
import { Note, SoundName } from '../../common/core/note.model';
import { TransportService } from '../../common/core/transport.service';
import { Phrase } from '../../common/phrase/phrase.model';

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
  beatsPerMeasure: string = '4';
  tempo: number = 120;
  latencyHint: string = 'balanced';

  tracks: Track[] = [
    { type: 'synth', notes: 'C2,C2|G1,G1|Bb1,Bb1|B1,B1|C2,C3|G1,G2|Bb1,Bb2|B1,B2' },
    { type: 'synth', notes: 'G4.C5.Eb5,|,G4.C5.Eb5||G4.C5.F5|G4.C5.Eb5,|,G4.C5.Eb5||A4.C5.F5' },
    { type: 'drums', notes: 'K|,K|S,K|,K|K|,K|S,K|S,S,K,S' }
  ];
  more = _.toPairs({
    Cowbell: [
      'A5,,A5,A5| E5,A5,E5,E5| A5,,A5,E5| | A5,,A5,A5| E5,A5,E5,E5| A5,,,E5',
      'C1,C2,C3,C4| C2,C3,C4,C5| C3,C4,C5,C6| C4,C5,C6,C7',
      'C1,C2,C3,C4| C5,C6,C7,C8| F#8,F#7,F#6,F#5| F#4,F#3,F#2,F#1'
    ],
    Synth: [
      'C2,B1,Bb1,A1| G#1,G1,F#1,F1| E1,Eb1,D1,C#1| C1,E1,G1,B1',
      'C1.C2.C3.C4.C5 .C6.C7.C8.C9| C4.E4.G4.Bb4| Db6.F6.Ab6.Cb7| D8.F#8.A8.C9'
    ]
  });
  selectedBeat: string;
  showFx: boolean = true;
  showSuggestions: boolean = false;

  phrase: Phrase = new Phrase();
  debugPhrase: string[] = [];
  fixedNotes: string[] = [];
  now: string;
  anySolo: boolean;

  private subscriptions: Subscription[];

  constructor(private transport: TransportService) {}

  ngOnInit() {
    this.subscriptions = [
      this.transport.pulse$.subscribe(pulse => {
        this.now = beatTickFrom(pulse.beat, pulse.tick);
      })
    ];
    this.transport.latencyHint = this.latencyHint;
    this.transport.reset([4]);
    this.parseNotes();
    function draw() {
      requestAnimationFrameId = requestAnimationFrame(draw);
    }
    draw();
  }

  ngOnDestroy() {
    _.invokeMap(this.subscriptions, 'unsubscribe');
    window.cancelAnimationFrame(requestAnimationFrameId);
    this.transport.stop(true);
  }

  @HostListener('document:keydown', ['$event'])
  handleKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.onPlay();
    } else if (event.key === ' ') {
      // Setting showFx to undefined also skips Tone.Draw work.
      this.showFx = this.showFx !== undefined ? undefined : true;
    }
  }

  onBpm(beatsPerMeasure: string) {
    this.transport.reset(beatsPerMeasure.split(',').map(_.toNumber));
  }

  onTempo(tempo: number) {
    this.transport.bpm = tempo;
  }

  onLatencyHint(latencyHint: string) {
    this.latencyHint = latencyHint;
    this.transport.latencyHint = latencyHint;
  }

  onPlay() {
    this.transport.resume();
    if (this.transport.started) {
      console.log('Stop');
      this.transport.stop();
    } else {
      console.log('Start');
      this.transport.start('+0.5');
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
    return _.startsWith(beatDebug, this.now);
  }

  onBeat(beatDebug: string) {
    this.transport.resume();
    if (this.selectedBeat !== beatDebug) {
      this.selectedBeat = beatDebug;
      this.fixedNotes = _.split(_.split(beatDebug, ': ')[1], ',');
    } else {
      this.selectedBeat = null;
      this.fixedNotes = [];
    }
  }

  hideSuggestions() {
    // Need to do this after timeout so that suggestion click handler has a chance
    setTimeout(() => {
      this.showSuggestions = false;
    }, 200);
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
        _.forEach(track.notes.split('|'), (beatNote, beatIndex) => {
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

    this.phrase = phrase;
    this.debugPhrase = phrase.toArray();
    this.fixedNotes = [];
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

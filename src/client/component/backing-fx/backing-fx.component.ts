import * as _ from 'lodash';
import * as Tone from 'tone';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { trigger, style, animate, transition, keyframes, query } from '@angular/animations';
import { Subscription } from 'rxjs/Subscription';

import { beatTickFrom } from '../../common/core/beat-tick.model';
import { Note } from '../../common/core/note.model';
import { Phrase } from '../../common/phrase/phrase.model';
import { SoundService } from '../../common/sound/sound.service';
import { TransportService } from '../../common/core/transport.service';

@Component({
  selector: 'backing-fx',
  templateUrl: 'backing-fx.component.pug',
  styleUrls: ['backing-fx.component.styl'],
  animations: [
    trigger('show', [
      transition(':enter', [
        query('.pitched', animate(100, keyframes([
            style({ transform: 'translateX(-40%)', opacity: 0 }),
            style({ transform: 'translate(0, 0) scale(1)', opacity: 1 })
          ])), { optional: true }),
        query('.unpitched', animate(250, keyframes([
            style({ transform: 'scale(0.8)', opacity: 0.5, offset: 0 }),
            style({ transform: 'scale(2)', opacity: 1, offset: 1 })
        ])), { optional: true })
      ]),
      transition(':leave', [
        /* TODO: Performance sucks!
        query('.shadow',
          animate(140, keyframes([
            style({ transform: 'scale(1)' }),
            style({ transform: 'scale(3)' })
          ])), { optional: true }), */
        query('.pitched', animate(140, keyframes([
            style({ transform: 'translateY(0) scale(1)', opacity: 1 }),
            style({ transform: 'translateY(20vh) scale(3, 1.5)', opacity: 0.3 })
          ])), { optional: true }),
        query('.unpitched', animate(150, keyframes([
            style({ transform: 'scale(0.8)', opacity: 0.5, offset: 0 }),
            style({ transform: 'scale(2)', opacity: 1, offset: 1 })
          ])), { optional: true }),
        query('.cowbell', animate(140, keyframes([
            style({ transform: 'scale(1)', opacity: 0.5 }),
            style({ transform: 'scale(3)', opacity: 0.1 })
          ])), { optional: true })
      ])
    ])
  ]
})
export class BackingFx implements OnInit, OnDestroy {
  @Input() private phrase: Phrase;
  @Input() show: boolean = true;
  @Input() showCounts: boolean = false;
  private _fixedNotes: string[] = [];
  private subscriptions: Subscription[];

  public notesMap: _.Dictionary<any> = {};
  public notes: any[] = [];
  public playCount: number = 0;
  public drawCount: number = 0;
  public undrawCount: number = 0;
  public playNotes: number = 0;
  public activeNotes: number = 0;

  constructor(private sound: SoundService, private transport: TransportService) { }

  ngOnInit() {
    this.subscriptions = [
      this.transport.pulse$.subscribe((pulse) => {
        if (!this.phrase) {
          return;
        }
        let startTime = _.now();
        let {time, beat, tick} = pulse;
        let now = beatTickFrom(beat, tick);
        let notes = this.phrase.getNotes(beat, tick);
        this.playNotes = notes.length;
        _.forEach(notes, (note) => {
          this.sound.play(note.soundName, time, note.params);
          if (this.show !== undefined) {
            this.playCount++;
            let id = note.toString() + now;
            Tone.Draw.schedule(() => {
              this.setBackingNote(note, id);
              this.drawCount++;
              this.activeNotes++;
              this.notes = _.filter(this.notesMap, 'on');
            }, time);
            Tone.Draw.schedule(() => {
              if (this.notesMap[id]) {
                this.notesMap[id].on = false;
              }
              this.undrawCount++;
              this.activeNotes--;
              this.notes = _.filter(this.notesMap, 'on');
            }, time + note.duration);
          }
        });
        let elapsedTime = _.now() - startTime;
        elapsedTime > 10 && console.log('pulse processing took ' + elapsedTime + 'ms')
      })
    ];
  }

  @Input() set fixedNotes(fixedNotes: string[]) {
    _.forEach(this._fixedNotes, (noteId) => {
      if (this.notesMap[noteId]) {
        this.notesMap[noteId].on = false;
      }
    });
    this._fixedNotes = fixedNotes;
    _.forEach(fixedNotes, (noteId) => {
      let note = Note.from(noteId);
      if (this.transport.paused) {
        this.sound.play(note.soundName, '+0.1', note.params);
      }
      this.setBackingNote(note, noteId);
    });
    this.notes = _.filter(this.notesMap, 'on');
  }

  private setBackingNote(note, id) {
    let backingNote = this.notesMap[id] || (this.notesMap[id] = {id});
    let frequency = note.frequency;
    backingNote.on = true;
    backingNote.fxClass = note.soundName + (frequency ?
        ' rotate' + (frequency.toMidi() % 12) :
        ' rotate' + _.random(11) + ' offset' + _.random(24));
    backingNote.tiltTransform = frequency ? 'rotateX(40deg)' : 'rotateX(10deg)';
    backingNote.scaleTransform = !frequency ? '' : 'scale(' +
      (-.009375 * frequency.toMidi() + 1.225) + ',' +
      (frequency.toMidi() / -160 + 1.15) + ')';
    backingNote.noteClass = note.soundName === 'cowbell' ? 'cowbell delay' + _.random(4) :
      frequency ? 'pitched' : 'unpitched' + (note.soundName !== 'snare' ?
          ' before' + _.random(11) + ' after' + _.random(11) : '');
    backingNote.shadowHeight = backingNote.noteClass !== 'pitched' ? '0' :
      (frequency.toMidi() * -1.875 + 245) + '%';
  }

  resetCounts() {
    this.playCount = 0;
    this.drawCount = 0;
    this.undrawCount = 0;
    this.playNotes = 0;
    this.activeNotes = 0;
  }

  ngOnDestroy() {
    _.invokeMap(this.subscriptions, 'unsubscribe');
  }
}

import * as _ from 'lodash';

import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { trigger, style, animate, transition, keyframes, query } from '@angular/animations';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

import { Note } from '../../common/core/note.model';

class BackingNote {
  readonly id: string;
  readonly fxClass: string;
  readonly tiltTransform: string;
  readonly scaleTransform: string;
  readonly noteClass: string;
  readonly shadowHeight: string;

  constructor(readonly note: Note) {
    this.id = note.toString();
    let frequency = note.frequency;
    this.fxClass = note.soundName + (frequency ? ' rotate' + (frequency.toMidi() % 12) :
        ' rotate' + _.random(11) + ' offset' + _.random(24));
    this.tiltTransform = frequency ? 'rotateX(40deg)' : 'rotateX(10deg)';
    this.scaleTransform = !frequency ? '' : 'scale(' +
        (-.009375 * frequency.toMidi() + 1.225) + ',' +
        (frequency.toMidi() / -160 + 1.15) + ')';
    this.noteClass = note.soundName === 'cowbell' ? 'cowbell delay' + _.random(4) :
        frequency ? 'pitched' : 'unpitched' + (note.soundName !== 'snare' ?
            ' before' + _.random(11) + ' after' + _.random(11) : '');
    this.shadowHeight = this.noteClass !== 'pitched' ? '0' :
      (frequency.toMidi() * -1.875 + 245) + '%';
  }
}

@Component({
  selector: 'backing-fx',
  templateUrl: 'backing-fx.component.pug',
  styleUrls: ['backing-fx.component.styl'],
  animations: [
    trigger('show', [
      transition(':enter', [
        query('.pitched', animate(100, keyframes([
            style({ transform: 'scale(1.2, .8)', opacity: 0 }),
            style({ transform: 'scale(1)', opacity: 1 })
          ])), { optional: true }),
        query('.unpitched', animate(250, keyframes([
            style({ transform: 'scale(0.8)', opacity: 0.5, offset: 0 }),
            style({ transform: 'scale(2)', opacity: 1, offset: 0.3 }),
            style({ transform: 'scale(2.5)', opacity: 0.7, offset: 1 }),
        ])), { optional: true })
      ]),
      transition(':leave', [
        /* TODO: Performance sucks!
        query('.shadow',
          animate(140, keyframes([
            style({ opacity: 0, offset: 0 }),
            style({ opacity: 1, offset: 1 })
          ])), { optional: true })*/
        query('.pitched',
          animate(140, keyframes([
            style({ transform: 'translateY(0) scale(1)', opacity: 1 }),
            style({ transform: 'translateY(20vh) scale(3, 1.5)', opacity: 0.3 })
          ])), { optional: true }),
        query('.cowbell',
          animate(140, keyframes([
            style({ transform: 'scale(1)', opacity: 0.5 }),
            style({ transform: 'scale(3)', opacity: 0.1 })
          ])), { optional: true })
      ])
    ])
  ]
})
export class BackingFx implements OnChanges, OnDestroy {
  @Input() public notes$: Observable<Note[]>;
  @Input() public notesOff$: Observable<String[]>;
  private subscriptions: Subscription[];

  public notes: BackingNote[] = [];

  constructor() { }

  ngOnChanges() {
    if (!this.subscriptions) {
      this.subscriptions = [
        this.notes$.subscribe((notes) => {
          _.forEach(notes, (note) => {
            this.notes.push(new BackingNote(note));
          });
        }),
        this.notesOff$.subscribe((noteIds) => {
          _.forEach(noteIds, (noteId) => {
            _.remove(this.notes, (n) => {
              return n.id === noteId;
            });
          });
        })
      ];
    }
  }

  ngOnDestroy() {
    _.invokeMap(this.subscriptions, 'unsubscribe');
  }
}

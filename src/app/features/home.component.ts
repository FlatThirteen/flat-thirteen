import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';

import { AppState } from '../reducers';
import { Store } from '@ngrx/store';
import { UserActions } from '../user/user.actions';
import { User } from '../user/user.model';

@Component({
  selector: '.home',
  templateUrl: './home.component.html',
  styles: [`#my-logout-button { background: #F44336 }`]
})

export class HomeComponent implements OnDestroy, OnInit {
  destroyed$: Subject<any> = new Subject<any>();
  form: FormGroup;
  nameLabel = 'Enter your name';
  user: User;
  user$: Observable<User>;
  constructor(
    private store: Store<AppState>,
    private userActions: UserActions,
  ) {
    this.user$ = this.store.select(state => state.user.user);
    this.user$.takeUntil(this.destroyed$)
      .subscribe(user => { this.user = user; });
  }

  ngOnInit() {
  }

  clearName() {
    this.store.dispatch(this.userActions.editUser(
      Object.assign({}, this.user, { name: '' }
      )));
  }

  logout() {
    this.store.dispatch(this.userActions.logout());
  }

  submitState() {
    this.store.dispatch(this.userActions.editUser(
      Object.assign({}, this.user, { name: this.form.get('name').value }
      )));
  }

  ngOnDestroy() {
    this.destroyed$.next();
  }
}

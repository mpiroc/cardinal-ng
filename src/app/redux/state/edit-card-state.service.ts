import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Map } from 'immutable';
import { IState } from '../state';
import {
  editCardSetFront,
  editCardSetBack,
} from '../actions/edit-card';

@Injectable()
export class EditCardStateService {
  constructor(private ngRedux: NgRedux<IState>) {
  }

  private get state(): Map<string, any> {
    return this.ngRedux.getState().editCard;
  }

  get front() {
    return this.state.get('front');
  }

  get back() {
    return this.state.get('back');
  }

  selectFront(): Observable<string> {
    return this.ngRedux.select(['editCard', 'front']);
  }

  selectBack(): Observable<string> {
    return this.ngRedux.select(['editCard', 'back']);
  }

  setFront(front: string) {
    this.ngRedux.dispatch(editCardSetFront(front));
  }

  setBack(back: string) {
    this.ngRedux.dispatch(editCardSetBack(back));
  }
}

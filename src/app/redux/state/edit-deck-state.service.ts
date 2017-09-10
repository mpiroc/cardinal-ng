import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Map } from 'immutable';
import { IState } from '../state';

import {
  editDeckSetName,
  editDeckSetDescription,
} from '../actions/edit-deck';

@Injectable()
export class EditDeckStateService {
  constructor(private ngRedux: NgRedux<IState>) {
  }

  private get state(): Map<string, any> {
    return this.ngRedux.getState().editDeck;
  }

  get name() {
    return this.state.get('name');
  }

  get description() {
    return this.state.get('description');
  }

  selectName(): Observable<string> {
    return this.ngRedux.select(['editDeck', 'name']);
  }

  selectDescription(): Observable<string> {
    return this.ngRedux.select(['editDeck', 'description']);
  }

  setName(name: string) {
    this.ngRedux.dispatch(editDeckSetName(name));
  }

  setDescription(description: string) {
    this.ngRedux.dispatch(editDeckSetDescription(description));
  }
}

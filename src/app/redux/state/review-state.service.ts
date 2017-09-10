import { Injectable } from '@angular/core';
import { NgRedux } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { Map } from 'immutable';
import { IState } from '../state';
import {
  reviewSetDeck,
  reviewSetHistory,
  reviewSetGrade,
} from '../actions/review';
import {
  IDeck,
  ICardHistory,
} from '../../interfaces/firebase';

@Injectable()
export class ReviewStateService {
  constructor(private ngRedux: NgRedux<IState>) {
  }

  private get state(): Map<string, any> {
    return this.ngRedux.getState().review;
  }

  get deck(): IDeck {
    return this.state.get('deck');
  }

  get history(): ICardHistory {
    return this.state.get('history');
  }

  get grade(): number {
    return this.state.get('grade');
  }

  selectDeck(): Observable<IDeck> {
    return this.ngRedux.select(['review', 'deck']);
  }

  selectHistory(): Observable<ICardHistory> {
    return this.ngRedux.select(['review', 'history']);
  }

  selectGrade(): Observable<number> {
    return this.ngRedux.select(['review', 'grade']);
  }

  setDeck(deck: IDeck): void {
    this.ngRedux.dispatch(reviewSetDeck(deck));
  }

  setHistory(history: ICardHistory) {
    this.ngRedux.dispatch(reviewSetHistory(history));
  }

  setGrade(grade: number) {
    this.ngRedux.dispatch(reviewSetGrade(grade));
  }
}

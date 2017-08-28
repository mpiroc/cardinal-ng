import { Map } from 'immutable';
import { Action } from 'redux';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgRedux, select, WithSubStore } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { ICardArgs } from '../../services/database.service';
import { GradingService } from '../../services/grading.service';
import { IUserDeck, IDeckCard, ICardHistory } from '../../models/firebase-models';
import {
  CardHistoryActions,
  DeckCardActions,
  DeckCardListReducer,
} from '../../redux/firebase-modules';
import {
  reviewSetDeck,
  reviewSetHistory,
  reviewSelectGrade,
} from '../../redux/component-reducers';
import { IState, isListening } from '../../redux/state';

@Component({
  selector: 'cardinal-review-deck-route',
  templateUrl: './review-deck-route.component.html',
  styleUrls: [ './review-deck-route.component.css' ],
})
export class ReviewDeckRouteComponent implements OnInit {
  @select(['component', 'review', 'history'])
  private history$: Observable<ICardHistory>;

  @select(['component', 'review', 'grade'])
  private grade$: Observable<number>;

  constructor(
    private ngRedux: NgRedux<IState>,
    private activatedRoute: ActivatedRoute,
    private gradingService: GradingService) {
  }

  ngOnInit() {
    const deck: IUserDeck = this.activatedRoute.snapshot.data['deck'];
    this.ngRedux.dispatch(reviewSetDeck(deck));
  }

  onNext() {
    console.log("In onNext");
    //this.gradingService.submitGrade();
  }

  onSelectGrade(grade: number) {
    this.ngRedux.dispatch(reviewSelectGrade(grade));
  }

  getReviewText(grade: number) {
    switch (grade) {
      case 0:
        return "I completely forgot the card.";
      
      case 1:
        return "I forgot most of the card.";
      
      case 2:
        return "I forgot some of the card.";
      
      case 3:
        return "I remembered the card with much difficulty.";
      
      case 4:
        return "I remembered the card with some difficulty.";
      
      case 5:
        return "I easily remembered the card.";
      
      default:
        throw new RangeError(`Grade out of range: ${grade}`);
    }
  }
}
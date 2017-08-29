import { Map } from 'immutable';
import { Action } from 'redux';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgRedux, select, WithSubStore } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { GradingService } from '../../services/grading.service';
import {
  IDeck,
  ICardHistory,
} from '../../interfaces/firebase';
import {
  reviewSetDeck,
  reviewSelectGrade,
} from '../../redux/actions/review';
import { IState } from '../../redux/state';

@Component({
  selector: 'cardinal-review-deck-route',
  templateUrl: './review-deck-route.component.html',
  styleUrls: [ './review-deck-route.component.css' ],
})
export class ReviewDeckRouteComponent implements OnInit {
  @select(['review', 'history'])
  private history$: Observable<ICardHistory>;

  @select(['review', 'grade'])
  private grade$: Observable<number>;

  constructor(
    private ngRedux: NgRedux<IState>,
    private activatedRoute: ActivatedRoute,
    private gradingService: GradingService) {
  }

  ngOnInit() {
    const deck: IDeck = this.activatedRoute.snapshot.data['deck'];
    this.ngRedux.dispatch(reviewSetDeck(deck));
  }

  onNext() {
    this.gradingService.submitGrade();
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
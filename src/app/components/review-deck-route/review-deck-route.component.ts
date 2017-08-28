import { Map } from 'immutable';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgRedux, select, WithSubStore } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { GradingService } from '../../services/grading.service';
import { IUserDeck, IDeckCard } from '../../models/firebase-models';
import {
  DeckCardActions,
  DeckCardListReducer,
} from '../../redux/firebase-modules';
import { reviewSelectGrade } from '../../redux/component-reducers';
import { IState, isListening } from '../../redux/state';


interface IResponse {
  grade: number;
  text: string;
}

@WithSubStore({
  basePathMethodName: "getBasePath",
  localReducer: DeckCardListReducer.reducer,
})
@Component({
  selector: 'cardinal-review-deck-route',
  templateUrl: './review-deck-route.component.html',
  styleUrls: [ './review-deck-route.component.css' ],
})
export class ReviewDeckRouteComponent implements OnInit {
  private deck: IUserDeck;
  private card$: Observable<IDeckCard>;
  private selectedGrade$: Observable<number>;

  @select(["data"])
  deckCards$: Observable<Map<string, IDeckCard>>;

  constructor(
    private ngRedux: NgRedux<IState>,
    private activatedRoute: ActivatedRoute,
    private gradingService: GradingService) {
  }

  ngOnInit() {
    this.deck = this.activatedRoute.snapshot.data['deck'];

    this.card$ = this.deckCards$
      .filter(deckCards => deckCards ? true : false)
      .filter(deckCards => deckCards.size > 0)
      .map(deckCards => deckCards.valueSeq().first());

    this.selectedGrade$ = this.ngRedux.select(['component', 'review', 'selectedGrade']);

    if (!isListening(this.ngRedux.getState().deckCard, this.deck.$key)) {
      this.ngRedux.dispatch(DeckCardActions.startListening({
        uid: this.deck.uid,
        deckId: this.deck.$key,
      }));
    }
  }

  getBasePath() : string[] {
    return ['deckCard', this.deck.$key];
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
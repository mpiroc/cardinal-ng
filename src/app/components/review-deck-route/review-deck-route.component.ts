import { Map } from 'immutable';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgRedux, select, WithSubStore } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import { IUserDeck, IDeckCard } from '../../models/firebase-models';
import {
  DeckCardActions,
  DeckCardListReducer,
} from '../../redux/firebase-modules';
import { IState, isListening } from '../../redux/state';


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

  @select(["data"])
  deckCards$: Observable<Map<string, IDeckCard>>;


  constructor(
    private ngRedux: NgRedux<IState>,
    private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
    this.deck = this.activatedRoute.snapshot.data['deck'];

    this.card$ = this.deckCards$
      .filter(deckCards => deckCards ? true : false)
      .filter(deckCards => deckCards.size > 0)
      .map(deckCards => deckCards.valueSeq().first());

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
}
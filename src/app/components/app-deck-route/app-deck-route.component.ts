import { Map } from 'immutable';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgRedux, select, WithSubStore } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { IDeckCard } from '../../models/firebase-models';
import {
  DeckCardActions,
  DeckCardReducer,
} from '../../redux/firebase-modules';
import { IState, isListening } from '../../redux/state';

@WithSubStore({
  basePathMethodName: "getBasePath",
  localReducer: DeckCardReducer.reducer,
})
@Component({
  selector: 'app-deck-route',
  templateUrl: './app-deck-route.component.html',
  styleUrls: [ './app-deck-route.component.css' ],
})
export class AppDeckRouteComponent implements OnInit {
  private uid: string;
  private deckId: string;

  @select(["data"])
  deckCards$: Observable<Map<string, IDeckCard>>;

  constructor(
    private ngRedux: NgRedux<IState>,
    private activatedRoute: ActivatedRoute) {
  }

  getBasePath() : string[] {
    if (this.deckId) {
      return ['deckCards', this.deckId];
    }

    return null;
  }

  emptyIfNull(cards: Map<string, IDeckCard>): Map<string, IDeckCard> {
    return cards || Map<string, IDeckCard>();
  }

  ngOnInit(): void {
    const uid$ = this.ngRedux.select<string>(["user", "uid"]);
    const deckId$ = this.activatedRoute.paramMap
      .map(paramMap => paramMap.get('deckId'));

    Observable.combineLatest(uid$, deckId$)
      .subscribe(results => {
        const deckCards = this.ngRedux.getState().deckCards;

        this.uid = results[0];
        this.deckId = results[1];

        if (this.uid && this.deckId && !isListening(deckCards, this.deckId)) {
          this.ngRedux.dispatch(DeckCardActions.startListening({
            uid: this.uid,
            deckId: this.deckId,
          }));
        }
      });
  }
}
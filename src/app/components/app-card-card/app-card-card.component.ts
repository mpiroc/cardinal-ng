import { Component, Input, OnInit } from '@angular/core';
import { NgRedux, select, WithSubStore } from '@angular-redux/store';
import { IDeckCard } from '../../models/firebase-models';
import {
  CardContentActions,
  CardContentObjectReducer,
} from '../../redux/firebase-modules';
import { IState } from '../../redux/state';

@WithSubStore({
  basePathMethodName: "getBasePath",
  localReducer: CardContentObjectReducer.reducer.bind(CardContentObjectReducer),
})
@Component({
  selector: 'app-card-card',
  templateUrl: 'app-card-card.component.html',
  styleUrls: [ 'app-card-card.component.css' ],
})
export class AppCardCardComponent implements OnInit {
  @Input() card: IDeckCard;

  @select(["data", "front"])
  front$: string;

  @select(["data", "back"])
  back$: string;

  constructor(private ngRedux: NgRedux<IState>) {
  }

  getBasePath() {
    return [ "cardContent", this.card.$key ];
  }

  ngOnInit(): void {
    this.ngRedux.dispatch(CardContentActions.startListening({
      uid: this.card.uid,
      deckId: this.card.deckId,
      cardId: this.card.$key,
    }));
  }
}
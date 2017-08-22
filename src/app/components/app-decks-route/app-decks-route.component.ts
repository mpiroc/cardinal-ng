import { Component } from '@angular/core';
import { select } from '@angular-redux/store';
import { Map } from 'immutable';
import { Observable } from 'rxjs/Observable';
import { IUserDeck } from '../../models/firebase-models';

@Component({
  selector: 'app-decks-route',
  templateUrl: './app-decks-route.component.html',
  styleUrls: [ './app-decks-route.component.css' ],
})
export class AppDecksRouteComponent {
  @select(['userDecks', 'data'])
  decks$: Observable<Map<string, IUserDeck>>;

  emptyIfNull(cards: Map<string, IUserDeck>): Map<string, IUserDeck> {
    return cards || Map<string, IUserDeck>();
  }
}
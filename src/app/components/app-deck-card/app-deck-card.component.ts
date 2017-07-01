import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DatabaseService } from '../../services/database.service';
import { DeckModel } from '../../models/deck-model';

@Component({
  selector: 'app-deck-card',
  templateUrl: 'app-deck-card.component.html',
  styleUrls: [ 'app-deck-card.component.css' ],
})
export class AppDeckCardComponent implements OnInit {
  @Input() deck: DeckModel;
  count$: Observable<number>;

  constructor(private databaseService: DatabaseService) {
  }

  ngOnInit(): void {
    this.count$ = this.databaseService
      .getDeckCards(this.deck.uid, this.deck.deckId)
      .map(cards => cards.length);
  }
}

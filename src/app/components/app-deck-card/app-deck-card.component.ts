import { Component, Input, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { DatabaseService } from '../../services/database.service';
import * as fb from '../../models/firebase-models';

@Component({
  selector: 'app-deck-card',
  templateUrl: 'app-deck-card.component.html',
  styleUrls: [ 'app-deck-card.component.css' ],
})
export class AppDeckCardComponent implements OnInit {
  @Input() deck: fb.IUserDeck;
  count$: Observable<number>;

  constructor(private databaseService: DatabaseService, private snackbar: MdSnackBar) {
  }

  ngOnInit(): void {
    this.count$ = this.databaseService
      .getDeckCards(this.deck.uid, this.deck.deckId)
      .map(cards => cards.length)
      .catch(err => {
        console.error(err);
        this.snackbar.open(`Could not load card count`, null, { duration: 3000 });

        return Observable.of();
      });
  }
}

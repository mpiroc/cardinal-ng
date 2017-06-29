import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-deck-card',
  templateUrl: 'app-deck-card.component.html',
  styleUrls: [ 'app-deck-card.component.css' ],
})
export class AppDeckCardComponent implements OnInit {
  @Input() deck: any;
  name: string;
  description: string;
  count$: Observable<number>;

  constructor(private databaseService: DatabaseService) {
  }

  ngOnInit(): void {
    this.name = this.deck.name;
    this.description = this.deck.description;

    const uid: string = this.deck.uid;
    const deckId: string = this.deck.deckId;

    this.count$ = this.databaseService.getDeckCards(uid, deckId)
      .map(cards => {
        console.log('foo');
        console.log(`cards: ${cards}`);
        return cards.length;
      });
  }
}

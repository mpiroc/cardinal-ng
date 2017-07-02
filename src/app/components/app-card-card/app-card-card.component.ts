import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DeckCardModel } from '../../models/deck-card-model';
import { DatabaseService } from '../../services/database.service';

@Component({
  selector: 'app-card-card',
  templateUrl: 'app-card-card.component.html',
  styleUrls: [ 'app-card-card.component.css' ],
})
export class AppCardCardComponent implements OnInit {
  @Input() card: DeckCardModel;
  front: Observable<string>;
  back: Observable<string>;

  constructor(private databaseService: DatabaseService) {

  }

  ngOnInit(): void {
    const content$ = this.databaseService.getCardContent(
      this.card.uid,
      this.card.deckId,
      this.card.cardId);

    this.front = content$.map(content => content.side1);
    this.back = content$.map(content => content.side2);
  }
}
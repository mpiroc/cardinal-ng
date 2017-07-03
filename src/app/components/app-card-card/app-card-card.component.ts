import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { DatabaseService } from '../../services/database.service';
import * as fb from '../../models/firebase-models';

@Component({
  selector: 'app-card-card',
  templateUrl: 'app-card-card.component.html',
  styleUrls: [ 'app-card-card.component.css' ],
})
export class AppCardCardComponent implements OnInit {
  @Input() card: fb.IDeckCard;
  content$: Observable<fb.ICardContent>;

  constructor(private databaseService: DatabaseService) {

  }

  ngOnInit(): void {
    this.content$ = this.databaseService.getCardContent(
      this.card.uid,
      this.card.deckId,
      this.card.cardId)
      .startWith({
        side1: "",
        side2: "",
      });
  }
}
import { Component, Input, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';
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

  constructor(private databaseService: DatabaseService, private snackbar: MdSnackBar) {

  }

  ngOnInit(): void {
    const emptyCardContent = {
      ...this.card,
      front: "",
      back: "",
    };
    this.content$ = this.databaseService.getCardContent(
      this.card.uid,
      this.card.deckId,
      this.card.$key)
      .startWith(emptyCardContent)
      .catch(err => {
        console.error(err);
        this.snackbar.open(`Could not load card content`, null, { duration: 3000 });

        return Observable.of(emptyCardContent);
      });
  }
}
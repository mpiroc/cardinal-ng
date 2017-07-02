import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import { DeckCardModel } from '../../models/deck-card-model';


@Component({
  selector: 'app-deck-route',
  templateUrl: './app-deck-route.component.html',
  styleUrls: [ './app-deck-route.component.css' ],
})
export class AppDeckRouteComponent implements OnInit {
  deckCards$: Observable<DeckCardModel[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private databaseService: DatabaseService) {
  }

  ngOnInit(): void {
    console.log('ngOnInit');
    const uid$ = this.authService.user$.map(user =>user.uid);
    const deckId$ = this.activatedRoute.paramMap
      .map(paramMap => paramMap.get('deckId'));

    this.deckCards$ = Observable
      .combineLatest(uid$, deckId$)
      .switchMap(results => this.getCards(results[0], results[1]));
  }

  private getCards(uid: string, deckId: string) {
    return this.databaseService.getDeckCards(uid, deckId)
      .map((cards: any[]) => cards
        .map(card => ({
          uid: uid,
          deckId: deckId,
          cardId: card.cardId,
        } as DeckCardModel))
      );
  }
}
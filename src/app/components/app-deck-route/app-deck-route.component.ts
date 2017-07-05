import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import * as fb from '../../models/firebase-models';


@Component({
  selector: 'app-deck-route',
  templateUrl: './app-deck-route.component.html',
  styleUrls: [ './app-deck-route.component.css' ],
})
export class AppDeckRouteComponent implements OnInit {
  deckCards$: Observable<fb.IDeckCard[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private databaseService: DatabaseService) {
  }

  ngOnInit(): void {
    const uid$ = this.authService.user$.map(user => user ? user.uid : null);
    const deckId$ = this.activatedRoute.paramMap
      .map(paramMap => paramMap.get('deckId'));

    this.deckCards$ = Observable
      .combineLatest(uid$, deckId$)
      .switchMap(results => {
        const uid = results[0];
        const deckId = results[1];
        
        if (uid && deckId) {
          return this.databaseService.getDeckCards(results[0], results[1]);
        }

        return Observable.of();
      });
  }
}
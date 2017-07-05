import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import * as fb from '../../models/firebase-models';

@Component({
  selector: 'app-decks-route',
  templateUrl: './app-decks-route.component.html',
  styleUrls: [ './app-decks-route.component.css' ],
})
export class AppDecksRouteComponent implements OnInit {
  decks$: Observable<fb.IUserDeck[]>;

  constructor(private authService: AuthService, private databaseService: DatabaseService) {
  }

  ngOnInit(): void {
    this.decks$ = this.authService.user$
      .switchMap(user => user ?
        this.databaseService.getDecks(user.uid) :
        Observable.of());
  }
}
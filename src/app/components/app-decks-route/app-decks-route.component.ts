import { Component, Input, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
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

  constructor(private authService: AuthService, private databaseService: DatabaseService, private snackbar: MdSnackBar) {
  }

  ngOnInit(): void {
    this.decks$ = this.authService.user$
      .switchMap(user => user ?
        this.databaseService.getDecks(user.uid) :
        Observable.of())
      .catch(err => {
        console.error(err);
        this.snackbar.open(`Could not load decks`, null, { duration: 3000 });

        return Observable.of();
      });
  }
}
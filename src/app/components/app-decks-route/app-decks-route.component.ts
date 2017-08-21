import { Component, Input, OnInit } from '@angular/core';
import { MdSnackBar } from '@angular/material';
import { NgRedux, select } from '@angular-redux/store';
import { Set } from 'immutable';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/switchMap';
import { FirebaseListObservable } from 'angularfire2/database';
import { AuthService } from '../../services/auth.service';
import { DatabaseService } from '../../services/database.service';
import * as fb from '../../models/firebase-models';
import { IState } from '../../redux/state';

@Component({
  selector: 'app-decks-route',
  templateUrl: './app-decks-route.component.html',
  styleUrls: [ './app-decks-route.component.css' ],
})
export class AppDecksRouteComponent implements OnInit {
  decks$: Observable<fb.IUserDeck[]>;

  @select(['userDecks', 'deckIds'])
  deckIds$: Observable<Set<string>>;

  constructor(private ngRedux: NgRedux<IState>, private authService: AuthService, private databaseService: DatabaseService, private snackbar: MdSnackBar) {
  }

  ngOnInit(): void {
    this.decks$ = this.authService.user$
      .switchMap(user => user ?
        this.databaseService.getUserDecks(user.uid) :
        Observable.of())
      .catch(err => {
        console.error(err);
        this.snackbar.open(`Could not load decks`, null, { duration: 3000 });

        return Observable.of();
      });
  }
}
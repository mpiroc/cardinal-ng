import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { MdSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
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
    private databaseService: DatabaseService,
    private snackbar: MdSnackBar) {
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
          return this.databaseService.getCards(uid, deckId);
        }

        return Observable.of();
      })
      .catch(err => {
        console.error(err);
        this.snackbar.open(`Could not load cards`, null, { duration: 3000 });

        return Observable.of();
      });
  }
}
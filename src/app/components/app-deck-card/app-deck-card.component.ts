import { Component, Input, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { NgRedux, select, WithSubStore } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { Promise } from 'firebase';
import { DatabaseService } from '../../services/database.service';
import { IUserDeck } from '../../models/firebase-models';
import { AppEditDeckDialog, AppEditDeckDialogResult } from '../app-edit-deck-dialog/app-edit-deck-dialog.component';
import {
  DeckCardActions,
  DeckInfoActions,
  DeckInfoObjectReducer,
} from '../../redux/firebase-modules';
import { IState } from '../../redux/state';

@WithSubStore({
  basePathMethodName: "getBasePath",
  localReducer: DeckInfoObjectReducer.reducer.bind(DeckInfoObjectReducer),
})
@Component({
  selector: 'app-deck-card',
  templateUrl: 'app-deck-card.component.html',
  styleUrls: [ 'app-deck-card.component.css' ],
})
export class AppDeckCardComponent implements OnInit {
  @Input() deck: IUserDeck;
  
  count$: Observable<number>;

  @select(["data", "name"])
  name$: string;

  @select(["data", "description"])
  description$: string;

  constructor(private ngRedux: NgRedux<IState>, private databaseService: DatabaseService, private dialog: MdDialog) {
  }

  getBasePath() {
    return ["deckInfo", this.deck.$key];
  }

  ngOnInit(): void {
    const deckArgs = {
      uid: this.deck.uid,
      deckId: this.deck.$key,
    };
    this.ngRedux.dispatch(DeckInfoActions.startListening(deckArgs));
    this.ngRedux.dispatch(DeckCardActions.startListening(deckArgs));

    this.count$ = this.ngRedux
      .select(["deckCard", this.deck.$key, "data"])
      .map((cards: Map<string, any>) => cards.size);
  }

  onEdit(): void {
    const dialogRef: MdDialogRef<AppEditDeckDialog> = this.dialog.open(AppEditDeckDialog, {
      data: {
        name$: this.name$,
        description$: this.description$,
      },
    });
    dialogRef.afterClosed()
      .map(result => result || AppEditDeckDialogResult.Cancel)
      .switchMap(result => {
        try {
          switch (result) {
            case AppEditDeckDialogResult.Cancel:
              return Observable.of<void>();
            
            case AppEditDeckDialogResult.Save:
              return Observable.from(this.databaseService.updateDeckInfo({
                  uid: this.deck.uid,
                  deckId: this.deck.$key,
                },
                dialogRef.componentInstance.name,
                dialogRef.componentInstance.description,
              ));

            default:
              throw new Error(`Unknown dialog response: ${result}`);
          }
        }
        catch(err) {
          return this.logError(err, "Could not edit deck");
        }
      })
      .catch(err => this.logError(err, "Could not edit deck"))
      .subscribe();
  }

  logError(err: any, message: string): Observable<any> {
    console.error(err);
    return Observable.of();
  }
}

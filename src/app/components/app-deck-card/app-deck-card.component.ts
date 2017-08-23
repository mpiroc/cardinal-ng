import { Component, Input, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { NgRedux, select, WithSubStore } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { Promise } from 'firebase';
import { DatabaseService } from '../../services/database.service';
import * as fb from '../../models/firebase-models';
import { AppEditDeckDialog, AppEditDeckDialogResult } from '../app-edit-deck-dialog/app-edit-deck-dialog.component';
import {
  DeckInfoActions,
  DeckInfoReducer,
} from '../../redux/firebase-modules';
import { IState } from '../../redux/state';

@WithSubStore({
  basePathMethodName: "getBasePath",
  localReducer: DeckInfoReducer.reducer,
})
@Component({
  selector: 'app-deck-card',
  templateUrl: 'app-deck-card.component.html',
  styleUrls: [ 'app-deck-card.component.css' ],
})
export class AppDeckCardComponent implements OnInit {
  @Input() deck: fb.IUserDeck;
  
  count$: Observable<number>;

  @select(["data", "name"])
  name$: string;

  @select(["data", "description"])
  description$: string;

  constructor(private ngRedux: NgRedux<IState>, private databaseService: DatabaseService, private snackbar: MdSnackBar, private dialog: MdDialog) {
  }

  getBasePath() {
    return ["deckInfos", this.deck.$key];
  }

  ngOnInit(): void {
    this.ngRedux.dispatch(DeckInfoActions.startListening({
      uid: this.deck.uid,
      deckId: this.deck.$key,
    }));

    // TODO: Fetch from redux store
    this.count$ = this.databaseService
      .getDeckCards({
        uid: this.deck.uid,
        deckId: this.deck.$key,
      })
      .map(cards => cards.length)
      .catch(err => this.logError(err, "Could not load card count"));
  }

  onEdit(): void {
    const dialogRef: MdDialogRef<AppEditDeckDialog> = this.dialog.open(AppEditDeckDialog, {
      panelClass: 'test-panel-class',
      backdropClass: 'test-backdrop-class',
      data: {
        name$: this.name$,
        description$: this.description$,
      },
    });
    dialogRef.afterClosed()
      .map(result => result === undefined ? AppEditDeckDialogResult.Cancel : result)
      .switchMap(result => {
        try {
          switch (result) {
            case AppEditDeckDialogResult.Cancel:
              return Observable.of<void>();
            
            case AppEditDeckDialogResult.Save:
              
              const promise: Promise<void> = this.databaseService.updateDeckInfo(
                this.deck.uid,
                this.deck.$key,
                dialogRef.componentInstance.name,
                dialogRef.componentInstance.description,
              );
              return Observable.from(promise);
              

            default:
              throw new Error(`Unknown dialog response: ${result}`);
          }
        }
        catch(err) {
          this.logError(err, "Could not edit deck");
          return  Observable.of<void>();
        }
      })
      .catch(err => this.logError(err, "Could not edit deck"))
      .subscribe();
  }

  logError(err: any, message: string): Observable<any> {
    console.error(err);
    this.snackbar.open(`${message}: ${err.message}`, null, { duration: 3000});

    return Observable.of();
  }
}

import { Component, Input, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef, MdSnackBar } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import { Promise } from 'firebase';
import { DatabaseService } from '../../services/database.service';
import * as fb from '../../models/firebase-models';
import { AppEditDeckDialog, AppEditDeckDialogResult } from '../app-edit-deck-dialog/app-edit-deck-dialog.component';

@Component({
  selector: 'app-deck-card',
  templateUrl: 'app-deck-card.component.html',
  styleUrls: [ 'app-deck-card.component.css' ],
})
export class AppDeckCardComponent implements OnInit {
  @Input() deck: fb.IUserDeck;
  private deckInfo$: Observable<fb.IDeckInfo>;
  name$: Observable<string>;
  description$: Observable<string>;
  count$: Observable<number>;

  constructor(private databaseService: DatabaseService, private snackbar: MdSnackBar, private dialog: MdDialog) {
  }

  ngOnInit(): void {
    this.deckInfo$ = this.databaseService
      .getDeckInfo(this.deck.uid, this.deck.$key)
      .catch(err => this.logError(err, "Could not load deck info"));

    this.name$ = this.deckInfo$.map(info => info.name);
    this.description$ = this.deckInfo$.map(info => info.description);
    this.count$ = this.databaseService
      .getCards(this.deck.uid, this.deck.$key)
      .map(cards => cards.length)
      .catch(err => this.logError(err, "Could not load card count"));
  }

  onEdit(): void {
    const dialogRef: MdDialogRef<AppEditDeckDialog> = this.dialog.open(AppEditDeckDialog, {
      panelClass: 'test-panel-class',
      backdropClass: 'test-backdrop-class',
      data: this.deckInfo$,
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

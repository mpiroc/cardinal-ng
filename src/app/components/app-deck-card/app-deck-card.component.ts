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
  count$: Observable<number>;

  constructor(private databaseService: DatabaseService, private snackbar: MdSnackBar, private dialog: MdDialog) {
  }

  ngOnInit(): void {
    this.count$ = this.databaseService
      .getDeckCards(this.deck.uid, this.deck.deckId)
      .map(cards => cards.length)
      .catch(err => this.logError(err, "Could not load card count"));
  }

  onEdit(): void {
    const dialogRef: MdDialogRef<AppEditDeckDialog> = this.dialog.open(AppEditDeckDialog, {
      panelClass: 'test-panel-class',
      backdropClass: 'test-backdrop-class',
      data: this.deck,
    });
    dialogRef.afterClosed()
      .map(result => result === undefined ? AppEditDeckDialogResult.Cancel : result)
      .switchMap(result => {
        try {
          switch (result) {
            case AppEditDeckDialogResult.Cancel:
              return Observable.of<void>();
            
            case AppEditDeckDialogResult.Save:
              
              const promise: Promise<void> = this.databaseService.updateUserDeck(this.deck.uid, this.deck.deckId, {
                name: dialogRef.componentInstance.name,
                description: dialogRef.componentInstance.description,
              });
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

import { Component } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { select } from '@angular-redux/store';
import { Map } from 'immutable';
import { Observable } from 'rxjs/Observable';
import { DatabaseService } from '../../services/database.service';
import { IDeck } from '../../interfaces/firebase';
import {
  EditDeckDialog,
  EditDeckDialogResult,
} from '../edit-deck-dialog/edit-deck-dialog.component';

@Component({
  selector: 'cardinal-decks-route',
  templateUrl: './decks-route.component.html',
  styleUrls: [ './decks-route.component.css' ],
})
export class DecksRouteComponent {
  @select(['user', 'data', 'uid'])
  uid$: Observable<string>;

  @select(['deck', 'data'])
  decks$: Observable<Map<string, IDeck>>;

  constructor(
    private databaseService: DatabaseService,
    private dialog: MdDialog) {
  }

  emptyIfNull(decks: Map<string, IDeck>): Map<string, IDeck> {
    return decks || Map<string, IDeck>();
  }

  onNewDeck(): void {
    const dialogRef: MdDialogRef<EditDeckDialog> = this.dialog.open(EditDeckDialog, {
      data: {
        title: "Create Deck",
        name$: Observable.of(''),
        description$: Observable.of(''),
      },
    });

    Observable.combineLatest(
      this.uid$,
      dialogRef.afterClosed().map(result => result || EditDeckDialogResult.Cancel))
      .switchMap(results => {
        const uid = results[0];
        const result = results[1];

        switch (result) {
          case EditDeckDialogResult.Cancel:
            return Observable.of<void>();

          case EditDeckDialogResult.Save:
            return Observable.from(this.databaseService.createDeck({ uid },
              dialogRef.componentInstance.name,
              dialogRef.componentInstance.description,
            ));

          default:
            throw new Error(`Unknown dialog response: ${result}`);
        }
      })
      .catch(err => this.logError(err, "Could not create deck"))
      .subscribe();
  }

  logError(err: any, message: string): Observable<any> {
    console.error(err);
    return Observable.of();
  }
}
import { Component, Input, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { NgRedux, select, WithSubStore } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { DatabaseService } from '../../services/database.service';
import { IDeckCard } from '../../models/firebase-models';
import {
  DeleteCardDialog,
  DeleteCardDialogResult,
} from '../delete-card-dialog/delete-card-dialog.component';
import {
  EditCardDialog,
  EditCardDialogResult,
} from '../edit-card-dialog/edit-card-dialog.component';
import {
  CardContentActions,
  CardContentObjectReducer,
} from '../../redux/firebase-modules';
import { IState } from '../../redux/state';

@WithSubStore({
  basePathMethodName: "getBasePath",
  localReducer: CardContentObjectReducer.reducer,
})
@Component({
  selector: 'cardinal-card-card',
  templateUrl: './card-card.component.html',
  styleUrls: [ './card-card.component.css' ],
})
export class CardCardComponent implements OnInit {
  @Input() card: IDeckCard;
  @Input() showActions: boolean;

  @select(["data", "front"])
  front$: string;

  @select(["data", "back"])
  back$: string;

  constructor(private ngRedux: NgRedux<IState>, private databaseService: DatabaseService, private dialog: MdDialog) {
  }

  getBasePath() {
    return [ "cardContent", this.card.$key ];
  }

  ngOnInit(): void {
    const cardArgs = {
      uid: this.card.uid,
      deckId: this.card.deckId,
      cardId: this.card.$key,
    };
    this.ngRedux.dispatch(CardContentActions.startListening(cardArgs));
  }

  onEdit() {
    const dialogRef: MdDialogRef<EditCardDialog> = this.dialog.open(EditCardDialog, {
      data: {
        title: "Edit Card",
        front$: this.front$,
        back$: this.back$,
      }
    });
    dialogRef.afterClosed()
      .map(result => result || EditCardDialogResult.Cancel)
      .switchMap(result => {
        try {
          switch (result) {
            case EditCardDialogResult.Cancel:
              return Observable.of<void>();

            case EditCardDialogResult.Save:
              return Observable.from(this.databaseService.updateCardContent({
                  uid: this.card.uid,
                  deckId: this.card.deckId,
                  cardId: this.card.$key,
                },
                dialogRef.componentInstance.front,
                dialogRef.componentInstance.back,
              ));

            default:
              throw new Error(`Unknown dialog response: ${result}`);
          }
        }
        catch (err) {
          return this.logError(err, "Could not edit card");
        }
      })
      .catch(err => this.logError(err, "Could not edit card"))
      .subscribe();
  }

  onDelete() {
    const dialogRef: MdDialogRef<DeleteCardDialog> = this.dialog.open(DeleteCardDialog);
    dialogRef.afterClosed()
      .map(result => result || DeleteCardDialogResult.Cancel)
      .switchMap(result => {
        try {
          switch (result) {
            case DeleteCardDialogResult.Cancel:
              return Observable.of<void>();

            case DeleteCardDialogResult.Ok:
              return Observable.from(this.databaseService.deleteCard({
                uid: this.card.uid,
                deckId: this.card.deckId,
                cardId: this.card.$key,
              }));

            default:
              throw new Error(`Unknown dialog response: ${result}`);
          }
        }
        catch (err) {
          return this.logError(err, "Could not delete card");
        }
      })
      .catch(err => this.logError(err, "Could not delete card"))
      .subscribe();
  }

  logError(err: any, message: string): Observable<any> {
    console.error(err);
    return Observable.of();
  }
}
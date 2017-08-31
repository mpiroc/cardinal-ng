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
import { LogService } from '../../services/log.service';
import { IDeck } from '../../interfaces/firebase';
import {
  EditDeckDialog,
  EditDeckDialogResult,
} from '../edit-deck-dialog/edit-deck-dialog.component';
import {
  DeleteDeckDialog,
  DeleteDeckDialogResult,
} from '../delete-deck-dialog/delete-deck-dialog.component';
import {
  CardActions,
  DeckInfoActions,
} from '../../redux/actions/firebase';
import { DeckInfoObjectReducer } from '../../redux/reducers/firebase';
import { IState } from '../../redux/state';

@WithSubStore({
  basePathMethodName: "getBasePath",
  localReducer: DeckInfoObjectReducer.reducer,
})
@Component({
  selector: 'cardinal-deck-card',
  templateUrl: './deck-card.component.html',
  styleUrls: [ './deck-card.component.css' ],
})
export class DeckCardComponent implements OnInit {
  @Input()
  deck: IDeck;
  
  count$: Observable<any>;

  @select(["isLoading"])
  isLoading$: Observable<boolean>;

  @select(["data", "name"])
  name$: Observable<string>;

  @select(["data", "description"])
  description$: Observable<string>;

  constructor(
    private ngRedux: NgRedux<IState>,
    private databaseService: DatabaseService,
    private dialog: MdDialog,
    private logService: LogService) {
  }

  getBasePath() {
    return ["deckInfo", this.deck.deckId];
  }

  ngOnInit(): void {
    this.ngRedux.dispatch(DeckInfoActions.beforeStartListening(this.deck));
    this.ngRedux.dispatch(CardActions.beforeStartListening(this.deck));

    this.count$ = this.ngRedux
      .select(["card", this.deck.deckId])
      .map<Map<string, any>, any>(cards => {
        if (!cards) {
          return null;
        }

        if (cards.get('isLoading')) {
          return null;
        }

        const data: Map<string, any> = cards.get('data');
        if (!data) {
          return null;
        }

        return data.size;
      });
  }

  onEdit() {
    const dialogRef: MdDialogRef<EditDeckDialog> = this.dialog.open(EditDeckDialog, {
      data: {
        title: "Edit Deck",
        name$: this.name$,
        description$: this.description$,
      }
    });
    dialogRef.afterClosed()
      .map(result => result || EditDeckDialogResult.Cancel)
      .switchMap(result => {
        switch (result) {
          case EditDeckDialogResult.Cancel:
            return Observable.of<void>();
          
          case EditDeckDialogResult.Save:
            return Observable.from(this.databaseService.updateDeckInfo(
              this.deck,
              dialogRef.componentInstance.name,
              dialogRef.componentInstance.description,
            ));

          default:
            throw new Error(`Unknown dialog response: ${result}`);
        }
      })
      .catch(error => { 
        this.logService.error(error);
        return Observable.of();
      })
      .subscribe();
  }

  onDelete() {
    const dialogRef: MdDialogRef<DeleteDeckDialog> = this.dialog.open(DeleteDeckDialog, {
      data: { name$: this.name$ },
    });
    dialogRef.afterClosed()
      .map(result => result || DeleteDeckDialogResult.Cancel)
      .switchMap(result => {
        switch (result) {
          case DeleteDeckDialogResult.Cancel:
            return Observable.of<void>();

          case DeleteDeckDialogResult.Ok:
            return Observable.from<any>(this.databaseService.deleteDeck(this.deck));

          default:
            throw new Error(`Unknown dialog response: ${result}`);
        }
      })
      .catch(error => { 
        this.logService.error(error);
        return Observable.of();
      })
      .subscribe();
  }
}

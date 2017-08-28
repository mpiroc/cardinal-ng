import { Map } from 'immutable';
import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { NgRedux, select, WithSubStore } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { DatabaseService } from '../../services/database.service';
import {
  IUserDeck,
  IDeckCard,
} from '../../interfaces/firebase';
import { DeckCardActions } from '../../redux/actions/firebase';
import { DeckCardListReducer } from '../../redux/reducers/firebase';
import { IState, isListening } from '../../redux/state';
import {
  EditCardDialog,
  EditCardDialogResult,
} from '../edit-card-dialog/edit-card-dialog.component';

@WithSubStore({
  basePathMethodName: "getBasePath",
  localReducer: DeckCardListReducer.reducer,
})
@Component({
  selector: 'cardinal-deck-route',
  templateUrl: './deck-route.component.html',
  styleUrls: [ './deck-route.component.css' ],
})
export class DeckRouteComponent implements OnInit {
  private deck: IUserDeck;

  @select(["data"])
  deckCards$: Observable<Map<string, IDeckCard>>;

  constructor(
    private ngRedux: NgRedux<IState>,
    private activatedRoute: ActivatedRoute,
    private databaseService: DatabaseService,
    private dialog: MdDialog) {
  }

  ngOnInit(): void {
    this.deck = this.activatedRoute.snapshot.data['deck'];

    if (!isListening(this.ngRedux.getState().deckCard, this.deck.$key)) {
      this.ngRedux.dispatch(DeckCardActions.startListening({
        uid: this.deck.uid,
        deckId: this.deck.$key,
      }));
    }
  }

  getBasePath() : string[] {
    return ['deckCard', this.deck.$key];
  }

  emptyIfNull(cards: Map<string, IDeckCard>): Map<string, IDeckCard> {
    return cards || Map<string, IDeckCard>();
  }

  onNewCard() {
    const dialogRef: MdDialogRef<EditCardDialog> = this.dialog.open(EditCardDialog, {
      data: {
        title: "Create Card",
        front$: Observable.of(''),
        back$: Observable.of(''),
      },
    });

    dialogRef.afterClosed()
      .map(result => result || EditCardDialogResult.Cancel)
      .switchMap(result => {
        try {
          switch (result) {
            case EditCardDialogResult.Cancel:
              return Observable.of<void>();

            case EditCardDialogResult.Save:
              return Observable.from(
                this.databaseService.createCard({
                  uid: this.deck.uid,
                  deckId: this.deck.$key
                },
                dialogRef.componentInstance.front,
                dialogRef.componentInstance.back,
              ));

            default:
              throw new Error(`Unknown dialog response: ${result}`);
          }
        }
        catch (err) {
          return this.logError(err, "Could not create card");
        }
      })
      .catch(err => this.logError(err, "Could not create card"))
      .subscribe();
  }

  logError(err: any, message: string): Observable<any> {
    console.error(err);
    return Observable.of();
  }
}
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
  IDeck,
  ICard,
} from '../../interfaces/firebase';
import { CardActions } from '../../redux/actions/firebase';
import { CardListReducer } from '../../redux/reducers/firebase';
import { IState } from '../../redux/state';
import {
  EditCardDialog,
  EditCardDialogResult,
} from '../edit-card-dialog/edit-card-dialog.component';

@WithSubStore({
  basePathMethodName: "getBasePath",
  localReducer: CardListReducer.reducer,
})
@Component({
  selector: 'cardinal-deck-route',
  templateUrl: './deck-route.component.html',
  styleUrls: [ './deck-route.component.css' ],
})
export class DeckRouteComponent implements OnInit {
  private deck: IDeck;

  @select(["data"])
  cards$: Observable<Map<string, ICard>>;

  constructor(
    private ngRedux: NgRedux<IState>,
    private activatedRoute: ActivatedRoute,
    private databaseService: DatabaseService,
    private dialog: MdDialog) {
  }

  ngOnInit(): void {
    this.deck = this.activatedRoute.snapshot.data['deck'];

    this.ngRedux.dispatch(CardActions.startListening(this.deck));
  }

  getBasePath() : string[] {
    return ['card', this.deck.deckId];
  }

  emptyIfNull(cards: Map<string, ICard>): Map<string, ICard> {
    return cards || Map<string, ICard>();
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
        switch (result) {
          case EditCardDialogResult.Cancel:
            return Observable.of<void>();

          case EditCardDialogResult.Save:
            return Observable.from(
              this.databaseService.createCard(
              this.deck,
              dialogRef.componentInstance.front,
              dialogRef.componentInstance.back,
            ));

          default:
            throw new Error(`Unknown dialog response: ${result}`);
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
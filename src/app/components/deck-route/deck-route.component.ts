import { Map } from 'immutable';
import { Component, OnInit } from '@angular/core';
import { MdDialog, MdDialogRef } from '@angular/material';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgRedux, select, WithSubStore } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/combineLatest';
import 'rxjs/add/operator/map';
import { DatabaseService } from '../../services/database.service';
import { IDeckCard } from '../../models/firebase-models';
import {
  DeckCardActions,
  DeckCardListReducer,
} from '../../redux/firebase-modules';
import { IState, isListening } from '../../redux/state';
import {
  EditCardDialog,
  EditCardDialogResult,
} from '../edit-card-dialog/edit-card-dialog.component';

@WithSubStore({
  basePathMethodName: "getBasePath",
  localReducer: DeckCardListReducer.reducer.bind(DeckCardListReducer),
})
@Component({
  selector: 'cardinal-deck-route',
  templateUrl: './deck-route.component.html',
  styleUrls: [ './deck-route.component.css' ],
})
export class DeckRouteComponent implements OnInit {
  private uid$: Observable<string>;
  private deckId$: Observable<string>;
  private uid: string;
  private deckId: string;

  @select(["data"])
  deckCards$: Observable<Map<string, IDeckCard>>;

  constructor(
    private ngRedux: NgRedux<IState>,
    private activatedRoute: ActivatedRoute,
    private databaseService: DatabaseService,
    private dialog: MdDialog) {
  }

  ngOnInit(): void {
    this.uid$ = this.ngRedux.select<string>(["user", "data", "uid"]);
    this.deckId$ = this.activatedRoute.paramMap
      .map(paramMap => paramMap.get('deckId'));

    Observable.combineLatest(this.uid$, this.deckId$)
      .subscribe(results => {
        const deckCards = this.ngRedux.getState().deckCard;

        this.uid = results[0];
        this.deckId = results[1];

        if (this.uid && this.deckId && !isListening(deckCards, this.deckId)) {
          this.ngRedux.dispatch(DeckCardActions.startListening({
            uid: this.uid,
            deckId: this.deckId,
          }));
        }
      });
  }

  getBasePath() : string[] {
    if (this.deckId) {
      return ['deckCard', this.deckId];
    }

    return null;
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

    Observable.combineLatest(
      this.uid$,
      this.deckId$,
      dialogRef.afterClosed().map(result => result || EditCardDialogResult.Cancel))
      .switchMap(results => {
        const uid = results[0];
        const deckId = results[1];
        const result = results[2];

        try {
          switch (result) {
            case EditCardDialogResult.Cancel:
              return Observable.of<void>();

            case EditCardDialogResult.Save:
              return Observable.from(this.databaseService.createCard({ uid, deckId },
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
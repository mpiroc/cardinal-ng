import { Map } from 'immutable'
import { Component, OnInit } from '@angular/core'
import { MdDialog, MdDialogRef } from '@angular/material'
import { ActivatedRoute } from '@angular/router'
import { NgRedux, select, WithSubStore } from '@angular-redux/store'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/finally'
import 'rxjs/add/operator/do'
import { DatabaseService } from '../../services/firebase/database.service'
import { LogService } from '../../services/log.service'
import {
  IDeck,
  ICard,
} from '../../interfaces/firebase'
import { CardActions } from '../../redux/actions/firebase'
import { IState } from '../../redux/state'
import {
  editCardSetFront,
  editCardSetBack,
} from '../../redux/actions/edit-card'
import {
  EditCardDialogComponent,
  EditCardDialogResult,
} from '../edit-card-dialog/edit-card-dialog.component'

@Component({
  selector: 'cardinal-deck-route',
  templateUrl: './deck-route.component.html',
  styleUrls: [ './deck-route.component.scss' ],
})
export class DeckRouteComponent implements OnInit {
  private deck: IDeck

  isLoading$: Observable<boolean>
  cards$: Observable<Map<string, ICard>>

  constructor(
    private ngRedux: NgRedux<IState>,
    private activatedRoute: ActivatedRoute,
    private databaseService: DatabaseService,
    private dialog: MdDialog,
    private logService: LogService,
    private cardActions: CardActions,
  ) {
  }

  ngOnInit(): void {
    this.deck = this.activatedRoute.snapshot.data['deck']

    this.ngRedux.dispatch(this.cardActions.beforeStartListening(this.deck))

    this.isLoading$ = this.ngRedux.select(['card', this.deck.deckId, 'isLoading'])
    this.cards$ = this.ngRedux.select(['card', this.deck.deckId, 'data'])
  }

  emptyIfNull(cards: Map<string, ICard>): Map<string, ICard> {
    return cards || Map<string, ICard>()
  }

  onNewCard() {
    this.ngRedux.dispatch(editCardSetFront(''))
    this.ngRedux.dispatch(editCardSetBack(''))

    const dialogRef: MdDialogRef<EditCardDialogComponent> = this.dialog.open(EditCardDialogComponent, {
      data: { title: 'Create Card' },
    })

    const dialogSubscription = dialogRef.afterClosed()
      .map(result => result || EditCardDialogResult.Cancel)
      .do(result => {
        const state = this.ngRedux.getState()
        this.ngRedux.dispatch(editCardSetFront(null))
        this.ngRedux.dispatch(editCardSetBack(null))

        switch (result) {
          case EditCardDialogResult.Cancel:
            return

          case EditCardDialogResult.Save:
            this.databaseService.createCard(
              this.deck,
              state.editCard.get('front'),
              state.editCard.get('back'),
            )
            return

          default:
            throw new Error(`Unknown dialog response: ${result}`)
        }
      })
      .catch(error => {
        this.logService.error(error)
        return Observable.of()
      })
      .finally(() => {
        dialogSubscription.unsubscribe()
      })
      .subscribe()
  }
}

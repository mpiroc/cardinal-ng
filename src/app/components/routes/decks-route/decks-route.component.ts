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
import { DatabaseService } from '../../../services/firebase/database.service'
import { LogService } from '../../../services/log.service'
import {
  IUser,
  IDeck,
} from '../../../interfaces/firebase'
import { DeckActions } from '../../../redux/actions/firebase'
import { IState } from '../../../redux/state'
import {
  editDeckSetName,
  editDeckSetDescription,
} from '../../../redux/actions/edit-deck'
import {
  EditDeckDialogComponent,
  EditDeckDialogResult,
} from '../../dialogs/edit-deck-dialog/edit-deck-dialog.component'

@Component({
  selector: 'cardinal-decks-route',
  templateUrl: './decks-route.component.html',
  styleUrls: [ './decks-route.component.scss' ],
})
export class DecksRouteComponent implements OnInit {
  private user: IUser

  @select(['deck', 'isLoading'])
  isLoading$: Observable<boolean>

  @select(['deck', 'data'])
  decks$: Observable<Map<string, IDeck>>

  constructor(
    private ngRedux: NgRedux<IState>,
    private activatedRoute: ActivatedRoute,
    private databaseService: DatabaseService,
    private dialog: MdDialog,
    private logService: LogService,
    private deckActions: DeckActions,
  ) {
  }

  ngOnInit(): void {
    this.user = this.activatedRoute.snapshot.data['user']

    this.ngRedux.dispatch(this.deckActions.beforeStartListening(this.user))
  }

  emptyIfNull(decks: Map<string, IDeck>): Map<string, IDeck> {
    return decks || Map<string, IDeck>()
  }

  onNewDeck(): void {
    this.ngRedux.dispatch(editDeckSetName(''))
    this.ngRedux.dispatch(editDeckSetDescription(''))

    const dialogRef: MdDialogRef<EditDeckDialogComponent> = this.dialog.open(EditDeckDialogComponent, {
      data: { title: 'Create Deck' },
    })

    const dialogSubscription = dialogRef.afterClosed()
      .map(result => result || EditDeckDialogResult.Cancel)
      .do(result => {
        const state = this.ngRedux.getState()
        this.ngRedux.dispatch(editDeckSetName(null))
        this.ngRedux.dispatch(editDeckSetDescription(null))

        switch (result) {
          case EditDeckDialogResult.Cancel:
            return

          case EditDeckDialogResult.Save:
            this.databaseService.createDeck(
              this.user,
              state.editDeck.get('name'),
              state.editDeck.get('description'),
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

import { Map } from 'immutable'
import { Component, OnInit } from '@angular/core'
import { MdDialog } from '@angular/material'
import { ActivatedRoute } from '@angular/router'
import { NgRedux, select } from '@angular-redux/store'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import { DatabaseService } from '../../../services/firebase/database.service'
import {
  IUser,
  IDeck,
} from '../../../interfaces/firebase'
import { DeckActions } from '../../../redux/actions/firebase'
import { IState } from '../../../redux/state'
import {
  EditDeckDialogComponent,
} from '../../dialogs/edit-deck-dialog/edit-deck-dialog.component'

@Component({
  selector: 'cardinal-decks-route',
  templateUrl: './decks-route.component.html',
  styleUrls: [ './decks-route.component.scss' ],
})
export class DecksRouteComponent implements OnInit {
  private user: IUser

  isLoading$: Observable<boolean>
  decks$: Observable<IDeck[]>

  constructor(
    private ngRedux: NgRedux<IState>,
    private activatedRoute: ActivatedRoute,
    private databaseService: DatabaseService,
    private dialog: MdDialog,
    private deckActions: DeckActions,
  ) {
  }

  ngOnInit(): void {
    this.user = this.activatedRoute.snapshot.data['user']
    this.isLoading$ = this.ngRedux.select(['deck', 'isLoading'])
    this.decks$ = this.ngRedux.select(['deck', 'data'])
      .map((decks: Map<string, IDeck>) => decks ? decks.toArray() : [])

    this.ngRedux.dispatch(this.deckActions.beforeStartListening(this.user))
  }

  onNewDeck() {
    const dialogRef = this.dialog.open(EditDeckDialogComponent, {
      data: {
        title: 'Create Deck',
        name$: Observable.of(''),
        description$: Observable.of(''),
      }
    })

    return dialogRef.componentInstance.getResult(
      (name, description) => this.databaseService.createDeck(this.user, name, description)
    )
  }
}

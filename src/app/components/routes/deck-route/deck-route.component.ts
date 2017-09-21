import { Map } from 'immutable'
import { Component, OnInit } from '@angular/core'
import { MdDialog, MdDialogRef } from '@angular/material'
import { ActivatedRoute } from '@angular/router'
import { NgRedux } from '@angular-redux/store'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import { DatabaseService } from '../../../services/firebase/database.service'
import {
  IDeck,
  ICard,
} from '../../../interfaces/firebase'
import { CardActions } from '../../../redux/actions/firebase'
import { IState } from '../../../redux/state'
import {
  EditCardDialogComponent,
} from '../../dialogs/edit-card-dialog/edit-card-dialog.component'

@Component({
  selector: 'cardinal-deck-route',
  templateUrl: './deck-route.component.html',
  styleUrls: [ './deck-route.component.scss' ],
})
export class DeckRouteComponent implements OnInit {
  private deck: IDeck

  isLoading$: Observable<boolean>
  cards$: Observable<ICard[]>

  constructor(
    private ngRedux: NgRedux<IState>,
    private activatedRoute: ActivatedRoute,
    private databaseService: DatabaseService,
    private dialog: MdDialog,
    private cardActions: CardActions,
  ) {
  }

  ngOnInit(): void {
    this.deck = this.activatedRoute.snapshot.data['deck']

    this.ngRedux.dispatch(this.cardActions.beforeStartListening(this.deck))

    this.isLoading$ = this.ngRedux.select(['card', this.deck.deckId, 'isLoading'])
    this.cards$ = this.ngRedux.select(['card', this.deck.deckId, 'data'])
      .map((cards: Map<string, ICard>) => cards ? cards.toArray() : [])
  }

  onNewCard() {
    const dialogRef = this.dialog.open(EditCardDialogComponent, {
      data: {
        title: 'Create Card',
        front$: Observable.of(''),
        back$: Observable.of(''),
      }
    })

    return dialogRef.componentInstance.getResult(
      (front, back) => this.databaseService.createCard(this.deck, front, back)
    )
  }
}

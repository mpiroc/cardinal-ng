import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
} from '@angular/core'
import {
  MdDialog,
  MdDialogRef,
} from '@angular/material'
import {
  NgRedux,
  select,
  WithSubStore,
} from '@angular-redux/store'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import { Subscription } from 'rxjs/Subscription'
import 'rxjs/add/observable/from'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/finally'
import { DatabaseService } from '../../../services/firebase/database.service'
import { LogService } from '../../../services/log.service'
import { IDeck, ICard } from '../../../interfaces/firebase'
import {
  EditDeckDialogComponent,
  EditDeckDialogResult,
} from '../../dialogs/edit-deck-dialog/edit-deck-dialog.component'
import {
  DeleteDeckDialogComponent,
  DeleteDeckDialogResult,
} from '../../dialogs/delete-deck-dialog/delete-deck-dialog.component'
import {
  editDeckSetName,
  editDeckSetDescription,
} from '../../../redux/actions/edit-deck'
import {
  CardActions,
  DeckInfoActions,
} from '../../../redux/actions/firebase'
import { IState } from '../../../redux/state'

@Component({
  selector: 'cardinal-deck',
  templateUrl: './deck.component.html',
  styleUrls: [ './deck.component.scss' ],
})
export class DeckComponent implements OnChanges {
  @Input()
  deck: IDeck

  isLoading$: Observable<boolean>
  name$: Observable<string>
  description$: Observable<string>
  count$: Observable<any>

  constructor(
    private ngRedux: NgRedux<IState>,
    private databaseService: DatabaseService,
    private dialog: MdDialog,
    private logService: LogService,
    private deckInfoActions: DeckInfoActions,
    private cardActions: CardActions,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.deck) {
      return
    }

    this.ngRedux.dispatch(this.deckInfoActions.beforeStartListening(this.deck))
    this.ngRedux.dispatch(this.cardActions.beforeStartListening(this.deck))

    this.isLoading$ = this.ngRedux.select(['deckInfo', this.deck.deckId, 'isLoading'])
    this.name$ = this.ngRedux.select(['deckInfo', this.deck.deckId, 'data', 'name'])
    this.description$ = this.ngRedux.select(['deckInfo', this.deck.deckId, 'data', 'description'])
    this.count$ = this.ngRedux
      .select(['card', this.deck.deckId])
      .map<Map<string, any>, any>(cards => {
        if (!cards) {
          return null
        }

        if (cards.get('isLoading')) {
          return null
        }

        const data: Map<string, ICard> = cards.get('data')
        if (!data) {
          return null
        }

        return data.size
      })
  }

  onEdit(): {
    subscription: Subscription,
    complete: Promise<any>,
  } {
    const dialogRef: MdDialogRef<EditDeckDialogComponent> = this.dialog.open(EditDeckDialogComponent, {
      data: {
        title: 'Edit Deck',
        name$: this.name$,
        description$: this.description$,
      }
    })

    return dialogRef.componentInstance.getResult(
      (name, description) => this.databaseService.updateDeckInfo(this.deck, name, description)
    )
  }

  onDelete() {
    const dialogRef: MdDialogRef<DeleteDeckDialogComponent> = this.dialog.open(DeleteDeckDialogComponent, {
      data: { name$: this.name$ },
    })

    return dialogRef.componentInstance.getResult(this.deck)
  }
}

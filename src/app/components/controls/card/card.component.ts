import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core'
import { MdDialog } from '@angular/material'
import {
  NgRedux,
  select,
} from '@angular-redux/store'
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import { DatabaseService } from '../../../services/firebase/database.service'
import { ICard } from '../../../interfaces/firebase'
import { DeleteCardDialogComponent } from '../../dialogs/delete-card-dialog/delete-card-dialog.component'
import { EditCardDialogComponent } from '../../dialogs/edit-card-dialog/edit-card-dialog.component'
import { CardContentActions } from '../../../redux/actions/firebase'
import { IState } from '../../../redux/state'

@Component({
  selector: 'cardinal-card',
  templateUrl: './card.component.html',
  styleUrls: [ './card.component.scss' ],
})
export class CardComponent implements OnChanges {
  @Input() card: ICard
  @Input() showActions: boolean

  isLoading$: Observable<boolean>
  front$: Observable<string>
  back$: Observable<string>

  constructor(
    private ngRedux: NgRedux<IState>,
    private databaseService: DatabaseService,
    private dialog: MdDialog,
    private cardContentActions: CardContentActions,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.card) {
      return
    }

    this.isLoading$ = this.ngRedux.select(['cardContent', this.card.cardId, 'isLoading'])
    this.front$ = this.ngRedux.select(['cardContent', this.card.cardId, 'data', 'front'])
    this.back$ = this.ngRedux.select(['cardContent', this.card.cardId, 'data', 'back'])

    this.ngRedux.dispatch(this.cardContentActions.beforeStartListening(this.card))
  }

  onEdit(): {
    subscription: Subscription,
    complete: Promise<any>,
  } {
    const dialogRef = this.dialog.open(EditCardDialogComponent, {
      data: {
        title: 'Edit Card',
        front$: this.front$,
        back$: this.back$,
      }
    })

    return dialogRef.componentInstance.getResult(
      (front, back) => this.databaseService.updateCardContent(this.card, front, back)
    )
  }

  onDelete(): {
    subscription: Subscription,
    complete: Promise<any>,
  } {
    const dialogRef = this.dialog.open(DeleteCardDialogComponent)

    return dialogRef.componentInstance.getResult(this.card)
  }
}

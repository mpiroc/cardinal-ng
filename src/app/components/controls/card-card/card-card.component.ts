import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
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
import 'rxjs/add/operator/first'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/takeUntil'
import 'rxjs/add/operator/finally'
import { DatabaseService } from '../../../services/firebase/database.service'
import { LogService } from '../../../services/log.service'
import { ICard } from '../../../interfaces/firebase'
import {
  DeleteCardDialogComponent,
  DeleteCardDialogResult,
} from '../../dialogs/delete-card-dialog/delete-card-dialog.component'
import {
  EditCardDialogComponent,
  EditCardDialogResult,
} from '../../dialogs/edit-card-dialog/edit-card-dialog.component'
import {
  editCardSetFront,
  editCardSetBack,
} from '../../../redux/actions/edit-card'
import { CardContentActions } from '../../../redux/actions/firebase'
import { IState } from '../../../redux/state'

@Component({
  selector: 'cardinal-card-card',
  templateUrl: './card-card.component.html',
  styleUrls: [ './card-card.component.scss' ],
})
export class CardCardComponent implements OnChanges {
  @Input() card: ICard
  @Input() showActions: boolean

  isLoading$: Observable<boolean>
  front$: Observable<string>
  back$: Observable<string>

  constructor(
    private ngRedux: NgRedux<IState>,
    private databaseService: DatabaseService,
    private dialog: MdDialog,
    private logService: LogService,
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
    const frontSubscription = this.front$.subscribe(front =>
      this.ngRedux.dispatch(editCardSetFront(front)))
    const backSubscription = this.back$.subscribe(back =>
      this.ngRedux.dispatch(editCardSetBack(back)))

    const dialogRef: MdDialogRef<EditCardDialogComponent> = this.dialog.open(EditCardDialogComponent, {
      data: { title: 'Edit Card' },
    })

    const completeSubject = new Subject<any>()
    const subscription = dialogRef.afterClosed().first()
      .map(result => result || EditCardDialogResult.Cancel)
      .switchMap(result => this.handleEditResult(result))
      .do(result => {
        subscription.unsubscribe()
        completeSubject.next()
        completeSubject.complete()
      })
      .catch(error => {
        this.logService.error(error.message)
        completeSubject.next()
        completeSubject.complete()
        return Observable.of()
      })
      .subscribe(result => {
        frontSubscription.unsubscribe()
        backSubscription.unsubscribe()
      })

    return {
      subscription,
      complete: completeSubject.toPromise(),
    }
  }

  private handleEditResult(result: EditCardDialogResult): Observable<any> {
    const state: IState = this.ngRedux.getState()
    this.ngRedux.dispatch(editCardSetFront(null))
    this.ngRedux.dispatch(editCardSetBack(null))

    switch (result) {
      case EditCardDialogResult.Cancel:
        return Observable.of<void>()

      case EditCardDialogResult.Save:
        return Observable.from<any>(
          this.databaseService.updateCardContent(
            this.card,
            state.editCard.get('front'),
            state.editCard.get('back'),
          )
        )

      default:
        throw new Error(`Unknown dialog response: ${result}`)
    }
  }

  onDelete(): {
    subscription: Subscription,
    complete: Promise<any>,
  } {
    const dialogRef: MdDialogRef<DeleteCardDialogComponent> = this.dialog.open(DeleteCardDialogComponent)

    const completeSubject = new Subject<any>()
    const subscription = dialogRef.afterClosed().first()
      .map(result => result || DeleteCardDialogResult.Cancel)
      .switchMap(result => this.handleDeleteResult(result))
      .do(result => {
        subscription.unsubscribe()
        completeSubject.next()
        completeSubject.complete()
      })
      .catch(error => {
        this.logService.error(error.message)
        completeSubject.next()
        completeSubject.complete()
        return Observable.of()
      })
      .subscribe()

    return {
      subscription,
      complete: completeSubject.toPromise(),
    }
  }

  private handleDeleteResult(result: DeleteCardDialogResult): Observable<any> {
    switch (result) {
      case DeleteCardDialogResult.Cancel:
        return Observable.of<void>()

      case DeleteCardDialogResult.Ok:
        return Observable.from<any>(this.databaseService.deleteCard(this.card))

      default:
        throw new Error(`Unknown dialog response: ${result}`)
    }
  }
}
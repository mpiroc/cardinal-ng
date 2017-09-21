import { Component, Inject } from '@angular/core'
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material'
import { NgRedux, select } from '@angular-redux/store'
import { Observable } from 'rxjs/Observable'
import { Subject } from 'rxjs/Subject'
import { Subscription } from 'rxjs/Subscription'
import 'rxjs/add/observable/of'
import 'rxjs/add/operator/catch'
import 'rxjs/add/operator/do'
import 'rxjs/add/operator/first'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/switchMap'
import 'rxjs/add/operator/toPromise'
import {
  editCardSetFront,
  editCardSetBack,
} from '../../../redux/actions/edit-card'
import { LogService } from '../../../services/log.service'
import { IState } from '../../../redux/state'

export enum EditCardDialogResult {
  Cancel,
  Save,
}

export interface IEditCardDialogData {
  title: string,
  front$: Observable<string>
  back$: Observable<string>
}

@Component({
  selector: 'cardinal-edit-card-dialog',
  templateUrl: './edit-card-dialog.component.html',
  styleUrls: [ './edit-card-dialog.component.scss' ],
})
export class EditCardDialogComponent {
  @select(['editCard', 'front'])
  front$: Observable<string>

  @select(['editCard', 'back'])
  back$: Observable<string>

  dialogResult: typeof EditCardDialogResult = EditCardDialogResult

  constructor(
    @Inject(MD_DIALOG_DATA) public data: IEditCardDialogData,
    private ngRedux: NgRedux<IState>,
    private dialogRef: MdDialogRef<EditCardDialogComponent>,
    private logService: LogService,
  ) {
  }

  onFrontInput($event: any) {
    this.ngRedux.dispatch(editCardSetFront($event.target.value))
  }

  onBackInput($event: any) {
    this.ngRedux.dispatch(editCardSetBack($event.target.value))
  }

  getResult(handleSave: (front: string, back: string) => Promise<void>): {
    subscription: Subscription,
    complete: Promise<any>,
  } {
    const frontSubscription = this.data.front$.subscribe(front =>
      this.ngRedux.dispatch(editCardSetFront(front)))
    const backSubscription = this.data.back$.subscribe(back =>
      this.ngRedux.dispatch(editCardSetBack(back)))

    const completeSubject = new Subject<any>()
    const subscription = this.dialogRef.afterClosed().first()
      .map(result => result || EditCardDialogResult.Cancel)
      .switchMap(result => this.handleEditResult(result, handleSave))
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
      .finally(() => {
        frontSubscription.unsubscribe()
        backSubscription.unsubscribe()
      })
      .subscribe()

    return {
      subscription,
      complete: completeSubject.toPromise(),
    }
  }

  private handleEditResult(
    result: EditCardDialogResult,
    handleSave: (front: string, back: string) => Promise<void>,
  ): Observable<any> {
    const state: IState = this.ngRedux.getState()
    this.ngRedux.dispatch(editCardSetFront(null))
    this.ngRedux.dispatch(editCardSetBack(null))

    switch (result) {
      case EditCardDialogResult.Cancel:
        return Observable.of<void>()

      case EditCardDialogResult.Save:
        return Observable.from<any>(handleSave(
          state.editCard.get('front'),
          state.editCard.get('back'),
        ))

      default:
        throw new Error(`Unknown dialog response: ${result}`)
    }
  }
}

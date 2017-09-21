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
  editDeckSetName,
  editDeckSetDescription,
} from '../../../redux/actions/edit-deck'
import { LogService } from '../../../services/log.service'
import { IState } from '../../../redux/state'

export enum EditDeckDialogResult {
  Cancel,
  Save,
}

export interface IEditDeckDialogData {
  title: string
  name$: Observable<string>
  description$: Observable<string>
}

@Component({
  selector: 'cardinal-edit-deck-dialog',
  templateUrl: './edit-deck-dialog.component.html',
  styleUrls: [ './edit-deck-dialog.component.scss' ],
})
export class EditDeckDialogComponent {
  @select(['editDeck', 'name'])
  name$: Observable<string>

  @select(['editDeck', 'description'])
  description$: Observable<string>

  dialogResult: typeof EditDeckDialogResult = EditDeckDialogResult

  constructor(
    @Inject(MD_DIALOG_DATA) public data: IEditDeckDialogData,
    private ngRedux: NgRedux<IState>,
    private dialogRef: MdDialogRef<EditDeckDialogComponent>,
    private logService: LogService,
  ) {
  }

  onNameInput($event: any) {
    this.ngRedux.dispatch(editDeckSetName($event.target.value))
  }

  onDescriptionInput($event: any) {
    this.ngRedux.dispatch(editDeckSetDescription($event.target.value))
  }

  getResult(handleSave: (name: string, description: string) => Promise<void>): {
    subscription: Subscription,
    complete: Promise<any>,
  } {
    const nameSubscription = this.data.name$.subscribe(name =>
      this.ngRedux.dispatch(editDeckSetName(name)))
    const descriptionSubscription = this.data.description$.subscribe(description =>
      this.ngRedux.dispatch(editDeckSetDescription(description)))

    const completeSubject = new Subject<any>()
    const subscription = this.dialogRef.afterClosed().first()
      .map(result => result || EditDeckDialogResult.Cancel)
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
        nameSubscription.unsubscribe()
        descriptionSubscription.unsubscribe()
      })
      .subscribe()

    return {
      subscription,
      complete: completeSubject.toPromise(),
    }
  }

  private handleEditResult(
    result: EditDeckDialogResult,
    handleSave: (name: string, description: string) => Promise<void>,
  ) {
    const state: IState = this.ngRedux.getState()
    this.ngRedux.dispatch(editDeckSetName(null))
    this.ngRedux.dispatch(editDeckSetDescription(null))

    switch (result) {
      case EditDeckDialogResult.Cancel:
        return Observable.of<void>()

      case EditDeckDialogResult.Save:
        return Observable.from(handleSave(
          state.editDeck.get('name'),
          state.editDeck.get('description'),
        ))

      default:
        throw new Error(`Unknown dialog response: ${result}`)
    }
  }
}

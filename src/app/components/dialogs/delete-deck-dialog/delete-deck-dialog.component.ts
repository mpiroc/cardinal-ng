import { Component, Inject } from '@angular/core'
import { MD_DIALOG_DATA, MdDialogRef } from '@angular/material'
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
import { DatabaseService } from '../../../services/firebase/database.service'
import { LogService } from '../../../services/log.service'
import { IDeck } from '../../../interfaces/firebase'

export enum DeleteDeckDialogResult {
  Cancel,
  Ok,
}

export interface IDeleteDeckDialogData {
  name$: Observable<string>
}

@Component({
  selector: 'cardinal-delete-deck-dialog',
  templateUrl: './delete-deck-dialog.component.html',
  styleUrls: [ './delete-deck-dialog.component.scss' ],
})
export class DeleteDeckDialogComponent {
  readonly name$: Observable<string>
  readonly dialogResult: typeof DeleteDeckDialogResult = DeleteDeckDialogResult

  constructor(
    @Inject(MD_DIALOG_DATA) data: IDeleteDeckDialogData,
    private databaseService: DatabaseService,
    private dialogRef: MdDialogRef<DeleteDeckDialogComponent>,
    private logService: LogService,
  ) {
    this.name$ = data.name$
  }

  getResult(deck: IDeck): {
    subscription: Subscription,
    complete: Promise<any>,
  } {
    const completeSubject = new Subject<any>()
    const subscription = this.dialogRef.afterClosed().first()
      .map(result => result || DeleteDeckDialogResult.Cancel)
      .switchMap(result => this.handleDeleteResult(deck, result))
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

  private handleDeleteResult(deck: IDeck, result: DeleteDeckDialogResult) {
    switch (result) {
      case DeleteDeckDialogResult.Cancel:
        return Observable.of<void>()

      case DeleteDeckDialogResult.Ok:
        return Observable.from<any>(this.databaseService.deleteDeck(deck))

      default:
        throw new Error(`Unknown dialog response: ${result}`)
    }
  }
}

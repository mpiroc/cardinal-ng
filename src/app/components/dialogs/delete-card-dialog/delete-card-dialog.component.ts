import { Component, Inject } from '@angular/core'
import { MdDialogRef } from '@angular/material'
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
import { ICard } from '../../../interfaces/firebase'

export enum DeleteCardDialogResult {
  Cancel,
  Ok,
}

@Component({
  selector: 'cardinal-delete-card-dialog',
  templateUrl: './delete-card-dialog.component.html',
  styleUrls: [ './delete-card-dialog.component.scss' ],
})
export class DeleteCardDialogComponent {
  readonly dialogResult: typeof DeleteCardDialogResult = DeleteCardDialogResult

  constructor(
    private databaseService: DatabaseService,
    private dialogRef: MdDialogRef<DeleteCardDialogComponent>,
    private logService: LogService,
  ) {
  }

  getResult(card: ICard): {
    subscription: Subscription,
    complete: Promise<any>,
  } {
    const completeSubject = new Subject<any>()
    const subscription = this.dialogRef.afterClosed().first()
      .map(result => result || DeleteCardDialogResult.Cancel)
      .switchMap(result => this.handleDeleteResult(card, result))
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

  private handleDeleteResult(card: ICard, result: DeleteCardDialogResult): Observable<any> {
    switch (result) {
      case DeleteCardDialogResult.Cancel:
        return Observable.of<void>()

      case DeleteCardDialogResult.Ok:
        return Observable.from<any>(this.databaseService.deleteCard(card))

      default:
        throw new Error(`Unknown dialog response: ${result}`)
    }
  }
}

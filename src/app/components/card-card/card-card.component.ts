import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import {
  MdDialog,
  MdDialogRef,
} from '@angular/material';
import {
  NgRedux,
  select,
  WithSubStore,
} from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { DatabaseService } from '../../services/database.service';
import { ICard } from '../../interfaces/firebase';
import {
  DeleteCardDialog,
  DeleteCardDialogResult,
} from '../delete-card-dialog/delete-card-dialog.component';
import {
  EditCardDialog,
  EditCardDialogResult,
} from '../edit-card-dialog/edit-card-dialog.component';
import { CardContentActions } from '../../redux/actions/firebase';
import { CardContentObjectReducer } from '../../redux/reducers/firebase';
import { IState } from '../../redux/state';

@WithSubStore({
  basePathMethodName: "getBasePath",
  localReducer: CardContentObjectReducer.reducer,
})
@Component({
  selector: 'cardinal-card-card',
  templateUrl: './card-card.component.html',
  styleUrls: [ './card-card.component.css' ],
})
export class CardCardComponent implements OnChanges {
  @Input() card: ICard;
  @Input() showActions: boolean;

  @select(["data", "front"])
  front$: string;

  @select(["data", "back"])
  back$: string;

  constructor(private ngRedux: NgRedux<IState>, private databaseService: DatabaseService, private dialog: MdDialog) {
  }

  getBasePath() {
    return [ "cardContent", this.card.cardId ];
  }

  ngOnChanges(changes: SimpleChanges) : void {
    if (changes.card) {
      this.ngRedux.dispatch(CardContentActions.startListening(this.card));
    }
  }

  onEdit() {
    const dialogRef: MdDialogRef<EditCardDialog> = this.dialog.open(EditCardDialog, {
      data: {
        title: "Edit Card",
        front$: this.front$,
        back$: this.back$,
      }
    });
    dialogRef.afterClosed()
      .map(result => result || EditCardDialogResult.Cancel)
      .switchMap(result => {
        switch (result) {
          case EditCardDialogResult.Cancel:
            return Observable.of<void>();

          case EditCardDialogResult.Save:
            return Observable.from(this.databaseService.updateCardContent(
              this.card,
              dialogRef.componentInstance.front,
              dialogRef.componentInstance.back,
            ));

          default:
            throw new Error(`Unknown dialog response: ${result}`);
        }
      })
      .catch(err => this.logError(err, "Could not edit card"))
      .subscribe();
  }

  onDelete() {
    const dialogRef: MdDialogRef<DeleteCardDialog> = this.dialog.open(DeleteCardDialog);
    dialogRef.afterClosed()
      .map(result => result || DeleteCardDialogResult.Cancel)
      .switchMap(result => {
        switch (result) {
          case DeleteCardDialogResult.Cancel:
            return Observable.of<void>();

          case DeleteCardDialogResult.Ok:
            return Observable.from<any>(this.databaseService.deleteCard(this.card));

          default:
            throw new Error(`Unknown dialog response: ${result}`);
        }
      })
      .catch(err => this.logError(err, "Could not delete card"))
      .subscribe();
  }

  logError(err: any, message: string): Observable<any> {
    console.error(err);
    return Observable.of();
  }
}
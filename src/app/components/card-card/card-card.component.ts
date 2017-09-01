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
import 'rxjs/add/operator/finally';
import { DatabaseService } from '../../services/firebase/database.service';
import { LogService } from '../../services/log.service';
import { ICard } from '../../interfaces/firebase';
import {
  DeleteCardDialog,
  DeleteCardDialogResult,
} from '../delete-card-dialog/delete-card-dialog.component';
import {
  EditCardDialog,
  EditCardDialogResult,
} from '../edit-card-dialog/edit-card-dialog.component';
import {
  editCardSetFront,
  editCardSetBack,
} from '../../redux/actions/edit-card';
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

  @select(["isLoading"])
  isLoading$: Observable<boolean>;

  @select(["data", "front"])
  front$: Observable<string>;

  @select(["data", "back"])
  back$: Observable<string>;

  constructor(
    private ngRedux: NgRedux<IState>,
    private databaseService: DatabaseService,
    private dialog: MdDialog,
    private logService: LogService) {
  }

  getBasePath() {
    return [ "cardContent", this.card.cardId ];
  }

  ngOnChanges(changes: SimpleChanges) : void {
    if (!changes.card) {
      return;
    }

    this.ngRedux.dispatch(CardContentActions.beforeStartListening(this.card));
  }

  onEdit() {
    const frontSubscription = this.front$.subscribe(front =>
      this.ngRedux.dispatch(editCardSetFront(front)));
    const backSubscription = this.back$.subscribe(back =>
      this.ngRedux.dispatch(editCardSetBack(back)));

    const dialogRef: MdDialogRef<EditCardDialog> = this.dialog.open(EditCardDialog, {
      data: { title: "Edit Card" },
    });
    const dialogSubscription = dialogRef.afterClosed()
      .map(result => result || EditCardDialogResult.Cancel)
      .do(result => {
        const state: IState = this.ngRedux.getState();
        this.ngRedux.dispatch(editCardSetFront(null));
        this.ngRedux.dispatch(editCardSetBack(null));

        switch (result) {
          case EditCardDialogResult.Cancel:
            return;

          case EditCardDialogResult.Save:
            this.databaseService.updateCardContent(
              this.card,
              state.editCard.get('front'),
              state.editCard.get('back'),
            );
            return;

          default:
            throw new Error(`Unknown dialog response: ${result}`);
        }
      })
      .catch(error => { 
        this.logService.error(error);
        return Observable.of();
      })
      .finally(() => {
        frontSubscription.unsubscribe();
        backSubscription.unsubscribe();
        dialogSubscription.unsubscribe();
      })
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
      .catch(error => { 
        this.logService.error(error);
        return Observable.of();
      })
      .subscribe();
  }
}
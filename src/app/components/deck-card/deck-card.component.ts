import {
  Component,
  Input,
  OnChanges,
  SimpleChanges
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
import { IDeck } from '../../interfaces/firebase';
import {
  EditDeckDialogComponent,
  EditDeckDialogResult,
} from '../edit-deck-dialog/edit-deck-dialog.component';
import {
  DeleteDeckDialogComponent,
  DeleteDeckDialogResult,
} from '../delete-deck-dialog/delete-deck-dialog.component';
import {
  editDeckSetName,
  editDeckSetDescription,
} from '../../redux/actions/edit-deck';
import {
  CardActions,
  DeckInfoActions,
} from '../../redux/actions/firebase';
import { DeckInfoObjectReducer } from '../../redux/reducers/firebase';
import { IState } from '../../redux/state';

@WithSubStore({
  basePathMethodName: 'getBasePath',
  localReducer: DeckInfoObjectReducer.reducer,
})
@Component({
  selector: 'cardinal-deck-card',
  templateUrl: './deck-card.component.html',
  styleUrls: [ './deck-card.component.css' ],
})
export class DeckCardComponent implements OnChanges {
  @Input()
  deck: IDeck;

  count$: Observable<any>;

  @select(['isLoading'])
  isLoading$: Observable<boolean>;

  @select(['data', 'name'])
  name$: Observable<string>;

  @select(['data', 'description'])
  description$: Observable<string>;

  constructor(
    private ngRedux: NgRedux<IState>,
    private databaseService: DatabaseService,
    private dialog: MdDialog,
    private logService: LogService) {
  }

  getBasePath() {
    return ['deckInfo', this.deck.deckId];
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!changes.deck) {
      return;
    }

    this.ngRedux.dispatch(DeckInfoActions.beforeStartListening(this.deck));
    this.ngRedux.dispatch(CardActions.beforeStartListening(this.deck));

    this.count$ = this.ngRedux
      .select(['card', this.deck.deckId])
      .map<Map<string, any>, any>(cards => {
        if (!cards) {
          return null;
        }

        if (cards.get('isLoading')) {
          return null;
        }

        const data: Map<string, any> = cards.get('data');
        if (!data) {
          return null;
        }

        return data.size;
      });
  }

  onEdit() {
    const nameSubscription = this.name$.subscribe(name =>
      this.ngRedux.dispatch(editDeckSetName(name)));
    const descriptionSubscription = this.description$.subscribe(description =>
      this.ngRedux.dispatch(editDeckSetDescription(description)));

    const dialogRef: MdDialogRef<EditDeckDialogComponent> = this.dialog.open(EditDeckDialogComponent, {
      data: { title: 'Edit Deck' }
    });
    const dialogSubscription = dialogRef.afterClosed()
      .map(result => result || EditDeckDialogResult.Cancel)
      .do(result => {
        const state: IState = this.ngRedux.getState();
        this.ngRedux.dispatch(editDeckSetName(null));
        this.ngRedux.dispatch(editDeckSetDescription(null));

        switch (result) {
          case EditDeckDialogResult.Cancel:
            return;

          case EditDeckDialogResult.Save:
            this.databaseService.updateDeckInfo(
              this.deck,
              state.editDeck.get('name'),
              state.editDeck.get('description'),
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
        nameSubscription.unsubscribe();
        descriptionSubscription.unsubscribe();
        dialogSubscription.unsubscribe();
      })
      .subscribe();
  }

  onDelete() {
    const dialogRef: MdDialogRef<DeleteDeckDialogComponent> = this.dialog.open(DeleteDeckDialogComponent, {
      data: { name$: this.name$ },
    });
    dialogRef.afterClosed()
      .map(result => result || DeleteDeckDialogResult.Cancel)
      .switchMap(result => {
        switch (result) {
          case DeleteDeckDialogResult.Cancel:
            return Observable.of<void>();

          case DeleteDeckDialogResult.Ok:
            return Observable.from<any>(this.databaseService.deleteDeck(this.deck));

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

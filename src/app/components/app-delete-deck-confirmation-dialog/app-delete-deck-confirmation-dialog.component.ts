import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { IDeckInfo } from '../../models/firebase-models';

export enum AppDeleteDeckConfirmationDialogResult {
  Cancel,
  Ok,
}

interface IAppDeleteDeckConfirmationDialogData {
  name$: Observable<string>;
}

@Component({
  selector: 'app-delete-deck-confirmation-dialog',
  templateUrl: './app-delete-deck-confirmation-dialog.component.html',
  styleUrls: [ './app-delete-deck-confirmation-dialog.component.css' ],
})
export class AppDeleteDeckConfirmationDialog {
  public name$: Observable<string>;
  dialogResult: typeof AppDeleteDeckConfirmationDialogResult = AppDeleteDeckConfirmationDialogResult;

  constructor(@Inject(MD_DIALOG_DATA) data: IAppDeleteDeckConfirmationDialogData) {
    this.name$ = data.name$;
  }
}
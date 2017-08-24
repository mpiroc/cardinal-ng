import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import { IDeckInfo } from '../../models/firebase-models';

export enum DeleteDeckConfirmationDialogResult {
  Cancel,
  Ok,
}

interface IDeleteDeckConfirmationDialogData {
  name$: Observable<string>;
}

@Component({
  selector: 'cardinal-delete-deck-confirmation-dialog',
  templateUrl: './delete-deck-confirmation-dialog.component.html',
  styleUrls: [ './delete-deck-confirmation-dialog.component.css' ],
})
export class DeleteDeckConfirmationDialog {
  public name$: Observable<string>;
  dialogResult: typeof DeleteDeckConfirmationDialogResult = DeleteDeckConfirmationDialogResult;

  constructor(@Inject(MD_DIALOG_DATA) data: IDeleteDeckConfirmationDialogData) {
    this.name$ = data.name$;
  }
}
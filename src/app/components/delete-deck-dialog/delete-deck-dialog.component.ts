import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';

export enum DeleteDeckDialogResult {
  Cancel,
  Ok,
}

interface IDeleteDeckDialogData {
  name$: Observable<string>;
}

@Component({
  selector: 'cardinal-delete-deck-dialog',
  templateUrl: './delete-deck-dialog.component.html',
  styleUrls: [ './delete-deck-dialog.component.css' ],
})
export class DeleteDeckDialogComponent {
  public name$: Observable<string>;
  dialogResult: typeof DeleteDeckDialogResult = DeleteDeckDialogResult;

  constructor(@Inject(MD_DIALOG_DATA) data: IDeleteDeckDialogData) {
    this.name$ = data.name$;
  }
}

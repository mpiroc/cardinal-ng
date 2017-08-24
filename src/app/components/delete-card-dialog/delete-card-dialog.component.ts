import { Component } from '@angular/core';

export enum DeleteCardDialogResult {
  Cancel,
  Ok,
}

@Component({
  selector: 'cardinal-delete-card-dialog',
  templateUrl: './delete-card-dialog.component.html',
  styleUrls: [ './delete-card-dialog.component.css' ],
})
export class DeleteCardDialog {
  dialogResult: typeof DeleteCardDialogResult = DeleteCardDialogResult;
}
import { Component } from '@angular/core';

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
  dialogResult: typeof DeleteCardDialogResult = DeleteCardDialogResult;
}

import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export enum EditDeckDialogResult {
  Cancel,
  Save,
}

interface IEditDeckDialogData {
  title: string;
  name$: Observable<string>;
  description$: Observable<string>;
}

@Component({
  selector: 'cardinal-edit-deck-dialog',
  templateUrl: './edit-deck-dialog.component.html',
  styleUrls: [ './edit-deck-dialog.component.css' ],
})
export class EditDeckDialog {
  public name: string;
  public description: string;
  dialogResult: typeof EditDeckDialogResult = EditDeckDialogResult;

  constructor(@Inject(MD_DIALOG_DATA) public data: IEditDeckDialogData) {
    data.name$.subscribe(name => this.name = name);
    data.description$.subscribe(description => this.description = description);
  }

  onNameInput($event: any) {
    this.name = $event.target.value;
  }

  onDescriptionInput($event: any) {
    this.description = $event.target.value;
  }
}
import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as fb from '../../models/firebase-models';

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
  public title: string;
  public name: string;
  public description: string;
  public name$: Observable<string>;
  public description$: Observable<string>;
  dialogResult: typeof EditDeckDialogResult = EditDeckDialogResult;

  constructor(@Inject(MD_DIALOG_DATA) data: IEditDeckDialogData) {
    this.title = data.title;
    this.name$ = data.name$.map(name => this.name = name);
    this.description$ = data.description$.map(description => this.description = description);
  }

  onNameInput($event: any) {
    this.name = $event.target.value;
  }

  onDescriptionInput($event: any) {
    this.description = $event.target.value;
  }
}
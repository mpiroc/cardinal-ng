import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import * as fb from '../../models/firebase-models';

export enum AppEditDeckDialogResult {
  Cancel,
  Save,
}

interface IAppEditDeckDialogData {
  name$: Observable<string>;
  description$: Observable<string>;
}

@Component({
  selector: 'app-edit-deck-dialog',
  templateUrl: './app-edit-deck-dialog.component.html',
  styleUrls: [ './app-edit-deck-dialog.component.css' ],
})
export class AppEditDeckDialog {
  public name: string;
  public description: string;
  public name$: Observable<string>;
  public description$: Observable<string>;
  dialogResult: typeof AppEditDeckDialogResult = AppEditDeckDialogResult;

  constructor(@Inject(MD_DIALOG_DATA) data: IAppEditDeckDialogData) {
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
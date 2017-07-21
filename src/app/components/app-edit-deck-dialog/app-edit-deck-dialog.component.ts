import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import * as fb from '../../models/firebase-models';

export enum AppEditDeckDialogResult {
  Cancel,
  Save,
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

  constructor(@Inject(MD_DIALOG_DATA) data: Observable<fb.IDeckInfo>) {
    this.name$ = data.map(info => this.name = info.name);
    this.description$ = data.map(info => this.description = info.description);
  }

  onNameInput($event: any) {
    this.name = $event.target.value;
  }

  onDescriptionInput($event: any) {
    this.description = $event.target.value;
  }
}
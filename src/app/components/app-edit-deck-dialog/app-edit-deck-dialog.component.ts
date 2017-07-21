import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
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
  dialogResult: typeof AppEditDeckDialogResult = AppEditDeckDialogResult;

  constructor(@Inject(MD_DIALOG_DATA) data: fb.IDeckInfo) {
    this.name = data.name;
    this.description = data.description;
  }
}
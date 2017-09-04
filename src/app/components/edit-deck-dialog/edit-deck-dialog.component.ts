import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {
  editDeckSetName,
  editDeckSetDescription,
} from '../../redux/actions/edit-deck';
import { IState } from '../../redux/state';

export enum EditDeckDialogResult {
  Cancel,
  Save,
}

interface IEditDeckDialogData {
  title: string;
}

@Component({
  selector: 'cardinal-edit-deck-dialog',
  templateUrl: './edit-deck-dialog.component.html',
  styleUrls: [ './edit-deck-dialog.component.css' ],
})
export class EditDeckDialogComponent {
  @select(['editDeck', 'name'])
  name$: Observable<string>;

  @select(['editDeck', 'description'])
  description$: Observable<string>;

  dialogResult: typeof EditDeckDialogResult = EditDeckDialogResult;

  constructor(
    @Inject(MD_DIALOG_DATA) public data: IEditDeckDialogData,
    private ngRedux: NgRedux<IState>) {
  }

  onNameInput($event: any) {
    this.ngRedux.dispatch(editDeckSetName($event.target.value));
  }

  onDescriptionInput($event: any) {
    this.ngRedux.dispatch(editDeckSetDescription($event.target.value));
  }
}

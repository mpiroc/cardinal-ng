import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { NgRedux, select } from '@angular-redux/store';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import {
  editCardSetFront,
  editCardSetBack,
} from '../../redux/actions/edit-card';
import { IState } from '../../redux/state';

export enum EditCardDialogResult {
  Cancel,
  Save,
}

interface IEditCardDialogData {
  title: string;
}

@Component({
  selector: 'cardinal-edit-card-dialog',
  templateUrl: './edit-card-dialog.component.html',
  styleUrls: [ './edit-card-dialog.component.css' ],
})
export class EditCardDialog {
  @select(["editCard", "front"])
  front$: Observable<string>;

  @select(["editCard", "back"])
  back$: Observable<string>;

  dialogResult: typeof EditCardDialogResult = EditCardDialogResult;

  constructor(
    @Inject(MD_DIALOG_DATA) public data: IEditCardDialogData,
    private ngRedux: NgRedux<IState>) {
  }

  onFrontInput($event: any) {
    this.ngRedux.dispatch(editCardSetFront($event.target.value));
  }

  onBackInput($event: any) {
    this.ngRedux.dispatch(editCardSetBack($event.target.value));
  }
}
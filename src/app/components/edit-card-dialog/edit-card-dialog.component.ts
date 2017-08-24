import { Component, Inject } from '@angular/core';
import { MD_DIALOG_DATA } from '@angular/material';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

export enum EditCardDialogResult {
  Cancel,
  Save,
}

interface IEditCardDialogData {
  title: string;
  front$: Observable<string>;
  back$: Observable<string>;
}

@Component({
  selector: 'cardinal-edit-card-dialog',
  templateUrl: './edit-card-dialog.component.html',
  styleUrls: [ './edit-card-dialog.component.css' ],
})
export class EditCardDialog {
  front: string;
  back: string;
  dialogResult: typeof EditCardDialogResult = EditCardDialogResult;

  constructor(@Inject(MD_DIALOG_DATA) public data: IEditCardDialogData) {
    data.front$.subscribe(front => this.front = front);
    data.back$.subscribe(back => this.back = back);
  }

  onFrontInput($event: any) {
    this.front = $event.target.value;
  }

  onBackInput($event: any) {
    this.back = $event.target.value;
  }

}
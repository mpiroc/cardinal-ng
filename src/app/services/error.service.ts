import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { MdSnackBar, MdSnackBarConfig } from '@angular/material';
import { Action } from 'redux';

@Injectable()
export class ErrorService {
  constructor(private snackbar: MdSnackBar) {
  }

  public handleError(error: Error, createAction?: (message: string) => Action) : Observable<Action> {
    console.error(error);
    this.snackbar.open(error.message, "Dismiss", {
      duration: 5000,
    });

    if (createAction) {
      return Observable.of(createAction(error.message));
    }

    return Observable.of();
  }
}
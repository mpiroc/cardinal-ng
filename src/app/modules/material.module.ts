import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MdButtonModule,
  MdCardModule,
  MdCheckboxModule,
  MdDialogModule,
  MdGridListModule,
  MdIconModule,
  MdInputModule,
  MdListModule,
  MdProgressSpinnerModule,
  MdRadioModule,
  MdSidenavModule,
  MdSnackBarModule,
  MdTabsModule,
  MdToolbarModule,
} from '@angular/material';
import { LogModule } from './log.module';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    MdButtonModule,
    MdCardModule,
    MdCheckboxModule,
    MdDialogModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdProgressSpinnerModule,
    MdRadioModule,
    MdSidenavModule,
    MdSnackBarModule,
    MdTabsModule,
    MdToolbarModule,
  ],
  exports: [
    MdButtonModule,
    MdCardModule,
    MdCheckboxModule,
    MdDialogModule,
    MdGridListModule,
    MdIconModule,
    MdInputModule,
    MdListModule,
    MdProgressSpinnerModule,
    MdRadioModule,
    MdSidenavModule,
    MdSnackBarModule,
    MdTabsModule,
    MdToolbarModule,
    LogModule,
  ],
})
export class MaterialModule { }

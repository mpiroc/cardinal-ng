import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MdButtonModule,
  MdCheckboxModule,
  MdIconModule,
  MdListModule,
  MdSidenavModule,
  MdToolbarModule,
} from '@angular/material';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    MdButtonModule,
    MdCheckboxModule,
    MdIconModule,
    MdListModule,
    MdSidenavModule,
    MdToolbarModule,
  ],
  exports: [
    MdButtonModule,
    MdCheckboxModule,
    MdIconModule,
    MdListModule,
    MdSidenavModule,
    MdToolbarModule,
  ],
})
export class MaterialModule { }
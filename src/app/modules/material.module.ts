import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {
  MdButtonModule,
  MdCardModule,
  MdCheckboxModule,
  MdGridListModule,
  MdIconModule,
  MdListModule,
  MdSidenavModule,
  MdTabsModule,
  MdToolbarModule,
} from '@angular/material';

@NgModule({
  imports: [
    BrowserAnimationsModule,
    MdButtonModule,
    MdCardModule,
    MdCheckboxModule,
    MdGridListModule,
    MdIconModule,
    MdListModule,
    MdSidenavModule,
    MdTabsModule,
    MdToolbarModule,
  ],
  exports: [
    MdButtonModule,
    MdCardModule,
    MdCheckboxModule,
    MdGridListModule,
    MdIconModule,
    MdListModule,
    MdSidenavModule,
    MdTabsModule,
    MdToolbarModule,
  ],
})
export class MaterialModule { }
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { MaterialModule } from './material.module';
import { AppComponent } from '../components/app/app.component';
import { AppSidenavComponent } from '../components/app-sidenav/app-sidenav.component';
import { AppToolbarComponent } from '../components/app-toolbar/app-toolbar.component';

import 'hammerjs';

@NgModule({
  declarations: [
    AppComponent,
    AppToolbarComponent,
    AppSidenavComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule { }

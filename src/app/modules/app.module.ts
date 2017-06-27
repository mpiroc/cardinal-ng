import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { AuthModule } from './auth.module';
import { MaterialModule } from './material.module';
import { AppComponent } from '../components/app/app.component';
import { AppExampleComponent } from '../components/app-example/app-example.component';
import { AppSidenavComponent } from '../components/app-sidenav/app-sidenav.component';
import { AppToolbarComponent } from '../components/app-toolbar/app-toolbar.component';

import 'hammerjs';

@NgModule({
  declarations: [
    AppComponent,
    AppExampleComponent,
    AppToolbarComponent,
    AppSidenavComponent,
  ],
  imports: [
    BrowserModule,
    MaterialModule,
    AuthModule,
    RouterModule.forRoot([
      {
        path: 'example',
        component: AppExampleComponent,
      },
    ]),
  ],
  providers: [],
  bootstrap: [ AppComponent ]
})
export class AppModule {
}

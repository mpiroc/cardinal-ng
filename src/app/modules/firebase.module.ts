import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { MaterialModule } from './material.module';

import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { AuthGuardService } from '../services/auth-guard.service';
import { AppLoginRouteComponent } from '../components/app-login-route/app-login-route.component';
import { AppLoginButtonComponent } from '../components/app-login-button/app-login-button.component';
import { DatabaseService } from '../services/database.service';

const routes = [
  {
    path: 'login',
    component: AppLoginRouteComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: '**',
    redirectTo: 'decks',
  },
];

@NgModule({
  imports: [
    BrowserModule,
    MaterialModule,
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
  ],
  declarations: [
    AppLoginRouteComponent,
    AppLoginButtonComponent,
  ],
  providers: [
    AuthService,
    AuthGuardService,
    DatabaseService,
  ],
  exports: [
    RouterModule,
    AppLoginButtonComponent,
  ]
})
export class FirebaseModule {
}
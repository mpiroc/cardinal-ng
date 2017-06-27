import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { MaterialModule } from './material.module';

import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { AuthGuardService } from '../services/auth-guard.service';
import { AppLoginPageComponent } from '../components/app-login-page/app-login-page.component';
import { AppLoginButtonComponent } from '../components/app-login-button/app-login-button.component';

const routes = [
  {
    path: 'login',
    component: AppLoginPageComponent,
    canActivate: [AuthGuardService],
  },
  {
    path: '**',
    redirectTo: 'example',
  },
];

@NgModule({
  imports: [
    BrowserModule,
    MaterialModule,
    RouterModule.forRoot(routes),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
  ],
  declarations: [
    AppLoginPageComponent,
    AppLoginButtonComponent,
  ],
  providers: [
    AuthService,
    AuthGuardService,
  ],
  exports: [
    RouterModule,
    AppLoginButtonComponent,
  ]
})
export class AuthModule {
}
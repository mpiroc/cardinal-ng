import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MaterialModule } from './material.module';
import { AppLoginPageComponent } from '../components/app-login-page/app-login-page.component';
import { AppLoginButtonComponent } from '../components/app-login-button/app-login-button.component';

@NgModule({
  imports: [
    BrowserModule,
    MaterialModule,
  ],
  declarations: [
    AppLoginPageComponent,
    AppLoginButtonComponent,
  ],
  exports: [
    AppLoginButtonComponent,
  ]
})
export class AuthModule {

}
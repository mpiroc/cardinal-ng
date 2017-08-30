import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { MaterialModule } from './material.module';
import { LogModule } from './log.module';

import { environment } from '../../environments/environment';
import { AuthService } from '../services/auth.service';
import { DatabaseService } from '../services/database.service';

@NgModule({
  imports: [
    BrowserModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFireDatabaseModule,
    LogModule,
  ],
  providers: [
    AuthService,
    DatabaseService,
  ],
})
export class FirebaseModule {
}
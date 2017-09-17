import { NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { AngularFireModule } from 'angularfire2'
import { AngularFireAuthModule } from 'angularfire2/auth'
import { AngularFireDatabaseModule } from 'angularfire2/database'
import { MaterialModule } from './material.module'
import { LogModule } from './log.module'

import { environment } from '../../environments/environment'
import { AuthService, AuthServiceImplementation } from '../services/firebase/auth.service'
import { AuthShimService, AuthShimServiceImplementation } from '../services/firebase/auth-shim.service'
import { DatabaseService, DatabaseServiceImplementation } from '../services/firebase/database.service'
import { DatabaseShimService, DatabaseShimServiceImplementation } from '../services/firebase/database-shim.service'

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
    { provide: AuthService, useClass: AuthServiceImplementation },
    { provide: AuthShimService, useClass: AuthShimServiceImplementation },
    { provide: DatabaseService, useClass: DatabaseServiceImplementation },
    { provide: DatabaseShimService, useClass: DatabaseShimServiceImplementation },
  ],
})
export class FirebaseModule {
}

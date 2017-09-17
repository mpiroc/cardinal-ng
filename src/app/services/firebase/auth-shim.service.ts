import { Injectable } from '@angular/core'
import { AngularFireAuth } from 'angularfire2/auth'
import { auth } from 'firebase/app'
import { Observable } from 'rxjs/Observable'
import 'rxjs/add/operator/map'
import { IUser } from '../../interfaces/firebase'

export abstract class AuthShimService {
  abstract getUser(): Observable<IUser>
  abstract setPersistence(persistence: firebase.auth.Auth.Persistence): Promise<any>
  abstract signInWithPopup(provider: firebase.auth.AuthProvider): Promise<any>
  abstract signInWithEmailAndPassword(email: string, password: string): Promise<any>
  abstract createUserWithEmailAndPassword(email: string, password: string): Promise<any>
  abstract signOut(): Promise<any>
  abstract sendPasswordResetEmail(email: string): Promise<any>
}

@Injectable()
export class AuthShimServiceImplementation extends AuthShimService {
  constructor(private afAuth: AngularFireAuth) {
    super()
  }

  getUser(): Observable<IUser> {
    return this.afAuth.authState.map(user => user ? { uid: user.uid } as IUser : null);
  }

  async setPersistence(persistence: firebase.auth.Auth.Persistence): Promise<any> {
    return await this.afAuth.auth.setPersistence(persistence)
  }

  async signInWithPopup(provider: firebase.auth.AuthProvider): Promise<any> {
    return await this.afAuth.auth.signInWithPopup(provider)
  }

  async signInWithEmailAndPassword(email: string, password: string): Promise<any> {
    return await this.afAuth.auth.signInWithEmailAndPassword(email, password)
  }

  async createUserWithEmailAndPassword(email: string, password: string): Promise<any> {
    return await this.afAuth.auth.createUserWithEmailAndPassword(email, password)
  }

  async signOut(): Promise<any> {
    return await this.afAuth.auth.signOut()
  }

  async sendPasswordResetEmail(email: string): Promise<any> {
    return await this.afAuth.auth.sendPasswordResetEmail(email)
  }
}
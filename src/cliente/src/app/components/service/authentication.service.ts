import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User, auth } from 'firebase/app';
import { first } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  user: User | undefined;
  
  constructor(public fireAuth: AngularFireAuth) {}

  async login(email: string, password: string) {
    try {
      let result = await this.fireAuth.signInWithEmailAndPassword(email, password);
      console.log("Logged");
    }
    catch(error) {
      console.log(error);
    }
  }

  async createAccountWithEmail(email: string, password: string) {
    try {
      let result = await this.fireAuth.createUserWithEmailAndPassword(email, password);
      this.sendEmailVerification();
    }
    catch(error) {
      console.log(error);
    }
  }
  
  async sendEmailVerification() {
    let user = await this.fireAuth.currentUser;
    if(user) {
      user.sendEmailVerification();
    }
    else {
      console.log("Error enviando email de verificacion");
    }
  }

  async sendPasswordResetEmail(passwordEmail: string) {
    return await this.fireAuth.sendPasswordResetEmail(passwordEmail);
  }

  async logout() {
    await this.fireAuth.signOut();
  }

  getCurrentUser() {
    return this.fireAuth.authState.pipe(first()).toPromise();
  }

  async loginWithGoogle() {
    let provider = new auth.GoogleAuthProvider();
    auth().languageCode = 'es';
    try {
      let result = await this.fireAuth.signInWithPopup(provider);
      this.sendEmailVerification();
    }
    catch(error) {
      console.log(error);
    }
  }

  async loginWithFacebook() {
    let provider = new auth.FacebookAuthProvider();
    auth().languageCode = 'es';
    try {
      let result = await this.fireAuth.signInWithPopup(provider);
      this.sendEmailVerification();
    }
    catch(error) {
      console.log(error);
    }
  }

  async loginWithTwitter() {
    let provider = new auth.TwitterAuthProvider();
    auth().languageCode = 'es';
    try {
      let result = await this.fireAuth.signInWithPopup(provider);
      this.sendEmailVerification();
    }
    catch(error) {
      console.log(error);
    }
  }

}

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { User, auth } from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  user: User | undefined;

  isLogged: boolean = false;
  
  constructor(public fireAuth: AngularFireAuth) { 
    fireAuth.useEmulator("http://localhost:9099/");
    this.fireAuth.authState.subscribe( user => {
      if(user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
      }
      else {
        localStorage.setItem('user', '');
      }
    });
  }

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
      console.log("Usuario creado");
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
    localStorage.removeItem('user');
  }

  isLoggedIn(): boolean {
    let userStr = localStorage.getItem('user');
    if(userStr) {
      const user = JSON.parse(userStr);
      return true;
    }
    return false;
  }

  async loginWithGoogle() {
    let provider = new auth.GoogleAuthProvider();
    auth().languageCode = 'es';
    let result = await this.fireAuth.signInWithRedirect(provider);
    this.sendEmailVerification();
  }

  async loginWithFacebook() {
    let provider = new auth.FacebookAuthProvider();
    auth().languageCode = 'es';
    let result = await this.fireAuth.signInWithRedirect(provider);
    this.sendEmailVerification();
  }

  async loginWithTwitter() {
    let provider = new auth.TwitterAuthProvider();
    auth().languageCode = 'es';
    let result = await this.fireAuth.signInWithRedirect(provider);
    this.sendEmailVerification();
  }

}

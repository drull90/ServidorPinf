import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

export class LoginComponent {

  constructor(private authService: AuthenticationService) {
  }

  loginWithPassword(username: string, password: string) {
    console.log("Logeando Usuario");
    this.authService.login(username, password);
  }

  loginWithGoogle() {
    this.authService.loginWithGoogle();
  }

  loginWithFacebook() {
    this.authService.loginWithFacebook();
  }

  loginWithTwitter() {
    this.authService.loginWithTwitter();
  }
}

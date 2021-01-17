import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [AuthenticationService]
})

export class LoginComponent {

  constructor(private authService: AuthenticationService, private router: Router) {}

  async loginWithPassword(username: string, password: string) {
    try {
      await this.authService.login(username, password);
      await this.redirectToHome();
    }
    catch(error) {
      alert(error);
    }
  }

  async loginWithGoogle() {
    try {
      await this.authService.loginWithGoogle();
      await this.redirectToHome();
    }
    catch(error) {
      alert(error);
    }
  }

  async loginWithFacebook() {
    try {
      await this.authService.loginWithFacebook();
      await this.redirectToHome();
    }
    catch(error) {
      alert(error);
    }
    
  }

  async loginWithTwitter() {
    try {
      await this.authService.loginWithTwitter();
      await this.redirectToHome();
    }
    catch(error) {
      alert(error);
    }
    
  }

  async redirectToHome() {
    await this.router.navigate(["/"]);
    window.location.reload();
  }
}

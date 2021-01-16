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
    await this.authService.login(username, password);
    await this.redirectToHome();
  }

  async loginWithGoogle() {
    await this.authService.loginWithGoogle();
    await this.redirectToHome();
  }

  async loginWithFacebook() {
    await this.authService.loginWithFacebook();
    await this.redirectToHome();
  }

  async loginWithTwitter() {
    await this.authService.loginWithTwitter();
    await this.redirectToHome();
  }

  async redirectToHome() {
    await this.router.navigate(["/"]);
    window.location.reload();
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [AuthenticationService]
})
export class RegisterComponent {

  private privacyAccepted: boolean = false;
  private responsibilityAccepted: boolean = false;

  constructor(private authService: AuthenticationService, private router: Router) {}

  checkedResponsibility(event: any) {
    if(event.target.checked) {
      this.responsibilityAccepted = true;
    }
    else {
      this.responsibilityAccepted = false;
    }
  }

  checkedPrivacy(event: any) {
    if(event.target.checked) {
      this.privacyAccepted = true;
    }
    else {
      this.privacyAccepted = false;
    }
  }

  async createAccountWithEmail(username: string, password: string) {
    if(this.checkPolicyAndResponsibilityAccepted()) {
      await this.authService.createAccountWithEmail(username, password);
      this.redirectToHome();
    }
  }

  async createAccountWithGoogle() {
    if(this.checkPolicyAndResponsibilityAccepted()) {
      await this.authService.loginWithGoogle();
      this.redirectToHome();     
    }
  }

  async createAccountWithFacebook() {
    if(this.checkPolicyAndResponsibilityAccepted()) {
      await this.authService.loginWithFacebook();
      this.redirectToHome();
    }
  }

  async createAccountWithTwitter() {
    if(this.checkPolicyAndResponsibilityAccepted()) {
      await this.authService.loginWithTwitter();
      this.redirectToHome();
    }
  }

  private checkPolicyAndResponsibilityAccepted(): boolean {
    if(this.privacyAccepted && this.responsibilityAccepted) {
      return true;
    }
    else {
      let privacyText = document.getElementById('privacyBoxText');
      let responibilityText = document.getElementById('responsibilityBoxText');
      if(privacyText) {
        if(this.privacyAccepted) {
          privacyText.style.color = '#666666';
        }
        else {
          privacyText.style.color = 'red';
        }
      }
      if(responibilityText) {
        if(this.responsibilityAccepted) {
          responibilityText.style.color = '#666666';
        }
        else {
          responibilityText.style.color = 'red';
        }
        
      }
      return false;
    }
  }

  private redirectToHome() {
    this.router.navigate(['home']);
  }

}

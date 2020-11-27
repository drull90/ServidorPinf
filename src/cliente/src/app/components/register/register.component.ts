import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {

  private privacyAccepted: boolean = false;
  private responsibilityAccepted: boolean = false;

  constructor(private authService: AuthenticationService) {}

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

  createAccountWithEmail(username: string, password: string) {
    if(this.checkPolicyAndResponsibilityAccepted()) {
      this.authService.createAccountWithEmail(username, password);
    }
  }

  createAccountWithGoogle() {
    if(this.checkPolicyAndResponsibilityAccepted()) {
      this.authService.loginWithGoogle();
    }
  }

  createAccountWithFacebook() {
    if(this.checkPolicyAndResponsibilityAccepted()) {
      this.authService.loginWithFacebook();
    }
  }

  createAccountWithTwitter() {
    if(this.checkPolicyAndResponsibilityAccepted()) {
      this.authService.loginWithTwitter();
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

}

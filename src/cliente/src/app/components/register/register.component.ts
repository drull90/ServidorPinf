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
      try {
        await this.authService.createAccountWithEmail(username, password);
        await this.redirectToHome();
      }
      catch(error) {
        alert(error);
      }
      
    }
  }

  async createAccountWithGoogle() {
    if(this.checkPolicyAndResponsibilityAccepted()) {
      try {
        await this.authService.loginWithGoogle();
        await this.redirectToHome(); 
      }
      catch(error) {
        alert(error);
      }
          
    }
  }

  async createAccountWithFacebook() {
    if(this.checkPolicyAndResponsibilityAccepted()) {
      try {
        await this.authService.loginWithFacebook();
        await this.redirectToHome();
      }
      catch(error) {
        alert(error);
      }
      
    }
  }

  async createAccountWithTwitter() {
    if(this.checkPolicyAndResponsibilityAccepted()) {
      try {
        await this.authService.loginWithTwitter();
        await this.redirectToHome();
      }
      catch(error) {
        alert(error);
      }
      
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

  private async redirectToHome() {
    await this.router.navigate(["/"]);
    window.location.reload();
  }

}

import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthenticationService } from './components/service/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AuthenticationService]
})
export class AppComponent implements OnInit {
  title = 'PinfBet';
  public language = 'es';

  constructor(private router: Router, private auth: AuthenticationService, public fireAuth: AngularFireAuth) {
    //fireAuth.useEmulator("http://192.168.0.2:9099/");
  }

  async ngOnInit() {
    // const user = await this.auth.getCurrentUser();
    // if(user) {
    //   this.router.navigate(['home']);
    // }
    // else {
    //   console.log("usuario sin logear");
    //   this.router.navigate(['login']);
    // }
  }

}

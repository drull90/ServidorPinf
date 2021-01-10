import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
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
    // if(environment.production == false)
    //   fireAuth.useEmulator("http://localhost:9099/");
  }

  async ngOnInit() {
    const user = await this.auth.getCurrentUser();
    if(!user) {
      this.router.navigate(['login']);
    }
    else {
      if(this.router.url === "/") {
        this.router.navigate(['home']);
      }
    }

  }

}

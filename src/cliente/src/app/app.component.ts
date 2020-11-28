import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AuthenticationService } from './components/service/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AuthenticationService]
})
export class AppComponent {
  title = 'PinfBet';
  public language = 'es';

  constructor(private router: Router, private auth: AuthenticationService, public fireAuth: AngularFireAuth) {
    fireAuth.useEmulator("http://192.168.0.2:9099/");
    // SI no esta loageado, va a login, si no no hace nada
  }

}

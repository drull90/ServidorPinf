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

  constructor(private router: Router, private auth: AuthenticationService, public fireAuth: AngularFireAuth) {}

  async ngOnInit() {
    const user = await this.auth.getCurrentUser();
    if(!user) {
      console.log("Usuario sin logear");
      if(!this.rutaSinLogin(this.router.url)) {
        this.router.navigate(['login']);
      }
    }
  }

  private rutaSinLogin(ruta: string): boolean {
    let isRutaSinLogin = false;

    let rutas = ["/login", "/register", "/", "/contact", "/aboutus", "responsibility-statement", "privacy-policy"];

    for(let i = 0; i < rutas.length; ++i) {
      if(rutas[i] === ruta) {
        isRutaSinLogin = true;
      }
    }

    return isRutaSinLogin;
  }

}

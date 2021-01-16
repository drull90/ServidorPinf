import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [AuthenticationService]
})
export class HomeComponent implements OnInit {

  nick: string = "";
  pinfcoins: number = 0;
  estado: string = "";

  constructor(public auth: AuthenticationService, private router: Router, private httpClient: HttpClient) {}

  async ngOnInit() {
    // let user = await this.auth.getCurrentUser();
    // let token = await user?.getIdToken();
    // let tokenString = "Bearer " + token;

    // let data = {
    //   destinatario: "HGFOTOEW",
    //   estado: "Aprueba",
    //   calificacion: 8,
    //   codigoAsig: "2007001"
    // }

    // this.httpClient.post(environment.url + "/apuesta", data, {headers: {'Authorization': tokenString}})
    // .subscribe(
    //   (response: any) => {   // data is already a JSON object
    //      console.log(response);
    //   }
    // );
  }

}

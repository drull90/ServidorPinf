import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userUID: string = "";
  token: string = "";
  data: any = {};

  constructor(public auth: AuthenticationService, private router: Router, private httpClient: HttpClient, private activatedRoute: ActivatedRoute) { }

  async ngOnInit() {

    let user = await this.auth.getCurrentUser();
    let token = await user?.getIdToken();
    let tokenString = "Bearer " + token;
    this.token = tokenString;

    this.activatedRoute.paramMap.subscribe(params => {
      let uid = params.get("userid");
      if(uid) {
        this.userUID = uid;
      }

      // Cargar datos del usuario

      this.httpClient.get(environment.url + "/profile/" + this.userUID, {headers: {'Authorization': tokenString}})
      .subscribe(
        (response: any) => {   // data is already a JSON object
          this.data = response;
          console.log(response);
        }
      );

    });

  }

  eliminarSolicitudAdmistad() {
    this.httpClient.delete(environment.url + "/peticion/" + this.userUID, {headers: {'Authorization': this.token}})
    .subscribe(
      (response: any) => {   // data is already a JSON object
        alert(response.message);
        this.data.amistad = '';
      },
      (error: any) => {
        alert(error.error.message);
      }
    );
  }

  eliminarAmigo() {
    this.httpClient.delete(environment.url + "/amistad/" + this.userUID, {headers: {'Authorization': this.token}})
    .subscribe(
      (response: any) => {   // data is already a JSON object
        alert(response.message);
        this.data.amistad = '';
      },
      (error: any) => {
        alert(error.error.message);
      }
    );
  }

  enviarSolicitudAmistad() {
    let data = {
      receptor: this.userUID
    }
    this.httpClient.post(environment.url + "/enviarsolicitudamistad/", data, {headers: {'Authorization': this.token}})
    .subscribe(
      (response: any) => {   // data is already a JSON object
        alert(response.message);
        this.data.amistad = 'enviada';
      },
      (error: any) => {
        alert(error.error.message);
      }
    );
  }

}

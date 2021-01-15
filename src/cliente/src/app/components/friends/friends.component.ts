import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-friends',
  templateUrl: './friends.component.html',
  styleUrls: ['./friends.component.css']
})
export class FriendsComponent implements OnInit {

  data: any = [];
  token: string = "";

  constructor(public auth: AuthenticationService, private router: Router, private httpClient: HttpClient) { }

  async ngOnInit() {

    let user = await this.auth.getCurrentUser();
    let token = await user?.getIdToken();
    let tokenString = "Bearer " + token;
    this.token = tokenString;

    this.httpClient.get(environment.url + "/amistades ", {headers: {'Authorization': tokenString}})
    .subscribe(
      (response: any) => {   // data is already a JSON object
        this.data = response.data;
        console.log(this.data);
      }
    );
  }

  aceptarPeticion(uid: String) {
    this.httpClient.post(environment.url + "/aceptarpeticion ", uid, {headers: {'Authorization': this.token}})
    .subscribe((response: any) => {   // data is already a JSON object
        
      }
    );

    // Buscamos por el uid, lo encontramos, cambiamos tipo a amistad

    for(let i = 0; i < this.data.length; ++i) {
      if(this.data[i].uid === uid) {
        let data = this.data[i];
        data.tipo = "amistad";
      }
    }

  }

  rechazarPeticion(uid: String) {
    this.httpClient.post(environment.url + "/rechazarpeticion ", uid, {headers: {'Authorization': this.token}})
    .subscribe((response: any) => {   // data is already a JSON object
        
      }
    );

    // Buscamos por uid, eliminamos de la lista
    for(let i = 0; i < this.data.length; ++i) {
      if(this.data[i].uid === uid) {
        this.data.splice(i, 1);
      }
    }
  }

  enviarSolicitud(nick: String) {

    if(!nick.startsWith("@")) {
      nick = "@" + nick;
    }
    let data = {
      receptor: nick
    }

    this.httpClient.post(environment.url + "/enviarsolicitudamistad ", data, {headers: {'Authorization': this.token}})
    .subscribe(
      (response: any) => {   // data is already a JSON object
        alert(response.message);
      },
      (error: any) => {
        alert(error.error.message);
      }
    );
  }

}

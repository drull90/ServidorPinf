import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl , FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-mi-perfil',
  templateUrl: './mi-perfil.component.html',
  styleUrls: ['./mi-perfil.component.css']
})
export class MiPerfilComponent implements OnInit {

  nickUsuario: string = "";
  pinfcoins: number = 0;
  estadoUsuario: string = "";
  email: string = "";
  token: string = "";

  constructor(public auth: AuthenticationService, private router: Router, private httpClient: HttpClient) {}

  async ngOnInit() {
    let user = await this.auth.getCurrentUser();
    let token = await user?.getIdToken();
    let tokenString = "Bearer " + token;
    this.token = tokenString;

    this.httpClient.get(environment.url + "/userdata", {headers: {'Authorization': tokenString}})
    .subscribe(
      (response: any) => {   // data is already a JSON object
         console.log(response);
         this.nickUsuario = response.nick;
         this.pinfcoins = response.pinfcoins;
         this.estadoUsuario = response.estado;
         this.email = response.email;
      }
    );
  
  }

  subirEstado(estado: string) {
    let data = {
      estado: estado
    }
    this.httpClient.post(environment.url + "/userstatus", data, {headers: {'Authorization': this.token}})
    .subscribe(
      (response: any) => {
        this.estadoUsuario = estado;
      },
      (error: any) => {
        alert(error.error.message);
      }
    );
  }
  actualizarNick(nick: string) {
    let data = {
      nick: nick
    };
    this.httpClient.post(environment.url + "/cambiarnick", data, {headers: {'Authorization': this.token}})
    .subscribe(
      (response: any) => {
        if(!nick.startsWith("@")) {
          nick = "@" + nick;
        }
        this.nickUsuario = nick;
      },
      (error: any) => {
        alert(error.error.message);
      }
    );
  }

}

import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-foro',
  templateUrl: './foro.component.html',
  styleUrls: ['./foro.component.css']
})
export class ForoComponent implements OnInit {

  foros:any = [];
  mensajes: any = [];
  token: string= "";
  foroIDActual:string = "";

  constructor(public auth: AuthenticationService, private router: Router, private httpClient: HttpClient) { }

  async ngOnInit() {
    let user = await this.auth.getCurrentUser();
    let token = await user?.getIdToken();
    let tokenString = "Bearer " + token;
    this.token = tokenString;

    this.httpClient.get(environment.url + "/foros ", {headers: {'Authorization': tokenString}})
    .subscribe(
      (response: any) => {   // data is already a JSON object
        this.foros = response.result;
        console.log(this.foros);
      }
    );

  }

  getMensajesForo(id: string) {
    this.mensajes = [];
    this.foroIDActual = id;
    this.httpClient.get(environment.url + "/msgforo/" + id, {headers: {'Authorization': this.token}})
    .subscribe(
      (response: any) => {   // data is already a JSON object
        this.mensajes = response.result;
        console.log(this.mensajes);
      }
    );
  }

  crearForo(titulo: string, texto: string) {
    let data = {
      title: titulo,
      msg: texto
    }
    this.httpClient.post(environment.url + "/foro/", data, {headers: {'Authorization': this.token}})
    .subscribe(
      (response: any) => {
        this.httpClient.get(environment.url + "/foros ", {headers: {'Authorization': this.token}})
        .subscribe(
          (response: any) => {   // data is already a JSON object
            this.foros = response.result;
            console.log(this.foros);
          }
        );
      },
      (response: any) => {
        alert(response.error.message);
      }
    );
  }

  postearForo(texto: string) { 
    console.log(texto);
    let data = {
      msg: texto,
      id: this.foroIDActual
    };
    this.httpClient.post(environment.url + "/msgforo", data, {headers: {'Authorization': this.token}})
    .subscribe(
      (response: any) => {   // data is already a JSON object
        this.getMensajesForo(this.foroIDActual);
      },
      (response: any) => {   // data is already a JSON object
        alert(response.error.message);
      }
    );
  }

}

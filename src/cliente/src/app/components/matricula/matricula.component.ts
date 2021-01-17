import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-matricula',
  templateUrl: './matricula.component.html',
  styleUrls: ['./matricula.component.css']
})
export class MatriculaComponent implements OnInit {

  matricula: any = [];
  token: string = "";
  afuConfig = {
    formatsAllowed: ".pdf",
    maxSize: 5,
    uploadAPI: {
      url: environment.url + "/matricula",
      responseType: 'arraybuffer',
      headers: {
        "Authorization": this.token
      }
    },
    theme: "dragNDrop"
  };

  constructor(public auth: AuthenticationService, private router: Router, private httpClient: HttpClient) { }

  async ngOnInit(){

    let user= await this.auth.getCurrentUser();
    let token = await user?.getIdToken();
    let tokenString = "Bearer " + token;
    this.token = tokenString;

    this.afuConfig = {
      formatsAllowed: ".pdf",
      maxSize: 5,
      uploadAPI: {
        url: environment.url + "/matricula",
        responseType: 'arraybuffer',
        headers: {
          "Authorization": this.token
        }
      },
      theme: "dragNDrop"
    };

    this.httpClient.get(environment.url + "/matricula", {headers: {'Authorization': tokenString}})
    .subscribe(
      (response: any) => {
        this.matricula = response.data;

        console.log(this.matricula);
      }
    );
  }

  formularioMatricula = new FormGroup({
    Codigo: new FormControl('', Validators.required),
  })

  subirMatriculaManual() {

    let data = {
      codigo: this.formularioMatricula.value["Codigo"]
    };

    this.httpClient.post(environment.url + "/subirMatriculaManual", data, {headers: {'Authorization': this.token}})
    .subscribe(
      (response: any) => {
        this.expedienteSubido(null);
        alert(response.message);
      },
      (error: any) => {
        alert(error.error.message);
      }
    );
  }

  expedienteSubido(event: any) {
    // Actualizamos los datos de la tabla
    this.httpClient.get(environment.url + "/matricula", {headers: {'Authorization': this.token}})
    .subscribe(
      (response: any) => {
        this.matricula = response.data;
      },
      (error: any) => {
        alert(error.error.message);
      }
    );
  }

}

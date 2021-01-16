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
    Código: new FormControl('', Validators.required),
    Nombre: new FormControl('', Validators.required)
  })

  subirMatriculaManual()
  {

    alert(JSON.stringify(this.formularioMatricula.value))

    let data = {
      codigo: this.formularioMatricula.Código,
      nombre: this.formularioMatricula.Nombre
    }
    this.httpClient.post(environment.url + "/subirMatriculaManual", data, {headers: {'Authorization': this.token}})
    .subscribe(
      (response: any) => {
        alert(response.message);
      },
      (error: any) => {
        alert(error.error.message);
      }
    );
  }

}

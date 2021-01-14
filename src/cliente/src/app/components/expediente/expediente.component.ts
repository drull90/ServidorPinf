import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFileUploaderConfig } from 'angular-file-uploader';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-expediente',
  templateUrl: './expediente.component.html',
  styleUrls: ['./expediente.component.css']
})
export class ExpedienteComponent implements OnInit {

  data: any = [];
  token: string = "";

  afuConfig = {
    formatsAllowed: ".pdf",
    maxSize: 5,
    uploadAPI: {
      url: environment.url + "/expediente",
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
        url: environment.url + "/expediente",
        responseType: 'arraybuffer',
        headers: {
          "Authorization": this.token
        }
      },
      theme: "dragNDrop"
    };

    this.httpClient.get(environment.url + "/expediente", {headers: {'Authorization': tokenString}})
    .subscribe(
      (response: any) => {
        this.data = response.data;

        console.log(this.data);
      }
    );
  }

}
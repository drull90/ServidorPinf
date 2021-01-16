import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-apuesta',
  templateUrl: './apuesta.component.html',
  styleUrls: ['./apuesta.component.css']
})
export class ApuestaComponent implements OnInit {
  
  token: string = "";

  this.activatedRoute.paramMap.subscribe(params => {
    let uid = params.get("userid"); 
  });
  this.activatedRoute.paramMap.subscribe(params => {
    let cod = params.get("codigo"); 
  });

  constructor(public auth: AuthenticationService, private router: Router, private httpClient: HttpClient) { }

  async ngOnInit(){

    let user= await this.auth.getCurrentUser();
    let token = await user?.getIdToken();
    let tokenString = "Bearer " + token;
    this.token = tokenString;
  }

  formularioApuesta = new FormGroup({
    Calificacion: new FormControl('', Validators.required),
    Estado: new FormControl('', Validators.required),
    PinfCoinsApostados: new FormControl('', Validators.required)
  })

  onSubmit()
  {
    let data = {
      destinatario: uid;
      codigoAsig: cod;
      calificacion: this.formularioApuesta.get('Calificacion'),
      Estado: this.formularioApuesta.get('Estado'),
      PinfCoinsApostados: this.formularioApuesta.get('PinfCoinsApostados')
    }
    this.httpClient.post(environment.url + "/apuesta", data, {headers: {'Authorization': this.token}})
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

import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-apuesta',
  templateUrl: './apuesta.component.html',
  styleUrls: ['./apuesta.component.css']
})
export class ApuestaComponent implements OnInit {
  
  token: string = "";
  uid: string = "";
  codigo: string = "";
  asignatura: string = "";
  nick: string = "";

  constructor(public auth: AuthenticationService, private router: Router, private httpClient: HttpClient, private activatedRoute: ActivatedRoute) { }

  async ngOnInit() {

    let user= await this.auth.getCurrentUser();
    let token = await user?.getIdToken();
    let tokenString = "Bearer " + token;
    this.token = tokenString;

    this.activatedRoute.paramMap.subscribe(params => {
      let userId = params.get("userid");
      if(userId) {
        this.uid =  userId;
      }
    });
    
    this.httpClient.get(environment.url + "/consultarNick/" + this.uid, {headers: {'Authorization': tokenString}})
    .subscribe(
      (response: any) => {
        this.nick = response.nick;
        console.log(this.nick);
      }
    );

    this.activatedRoute.paramMap.subscribe(params => {
      let cod = params.get("codigo"); 
      if(cod){
        this.codigo = cod;
      }
    });

    this.httpClient.get(environment.url + "/consultarAsignatura/" + this.codigo, {headers: {'Authorization': tokenString}})
    .subscribe(
      (response: any) => {
        this.asignatura = response.asignatura;
        console.log(this.nick);
      }
    );

  }

  formularioApuesta = new FormGroup({
    Calificacion: new FormControl('', Validators.required),
    Estado: new FormControl('', Validators.required),
    PinfCoinsApostados: new FormControl('', Validators.required)
  })

  onSubmit() {
    let data = {
      destinatario: this.uid,
      codigoAsig: this.codigo,
      calificacion: this.formularioApuesta.get('Calificacion'),
      estado: this.formularioApuesta.get('Estado'),
      pinfCoins: this.formularioApuesta.get('PinfCoinsApostados')
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

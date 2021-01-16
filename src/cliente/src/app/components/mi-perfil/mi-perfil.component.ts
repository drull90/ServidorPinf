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

  nick: string = "";
  pinfcoins: number = 0;
  estado: string = "";
  email: string = "";

  constructor(public auth: AuthenticationService, private router: Router, private httpClient: HttpClient) {}

  async ngOnInit() {
    let user = await this.auth.getCurrentUser();
    let token = await user?.getIdToken();
    let tokenString = "Bearer " + token;

    this.httpClient.get(environment.url + "/userdata", {headers: {'Authorization': tokenString}})
    .subscribe(
      (response: any) => {   // data is already a JSON object
         console.log(response);
         this.nick = response.nick;
         this.pinfcoins = response.pinfcoins;
         this.estado = response.estado;
         this.email = response.email;
      }
    );
  
  }

  /*
  StatusForm = new FormGroup({
    estado: new FormControl('', Validators.required),
  })

  updateStatus()
  {
    let data = {
      eatado: this.StatusForm.get('estado'),

    }
    this.httpClient.post(environment.url + "/userstatus", data, {headers: {'Authorization': this.token}})
    .subscribe(
      (response: any) => {
        alert(response.message);
      },
      (error: any) => {
        alert(error.error.message);
      }
    );
  }
*/
}

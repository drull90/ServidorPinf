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

  constructor(public auth: AuthenticationService, private router: Router, private httpClient: HttpClient) { }

  async ngOnInit() {

    let user = await this.auth.getCurrentUser();
    let token = await user?.getIdToken();
    let tokenString = "Bearer " + token;

    // let data = {
    //   uidPeticion: "HGFOTOEW"
    // }

    // this.httpClient.post(environment.url + "/rechazarpeticion ", data, {headers: {'Authorization': tokenString}})
    // .subscribe(
    //   (response) => {   // data is already a JSON object
    //      console.log(response);
    //   }
    // );

    // let data = {
    //   msg: "Gracias por la bienvenida",
    //   id: "m7ffsd7CN6RPCJCOUOPE"
    // };

    // this.httpClient.post(environment.url + "/msgforo ", data, {headers: {'Authorization': tokenString}})
    // .subscribe(
    //   (response) => {   // data is already a JSON object
    //      console.log(response);
    //   }
    // );



  }

}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [AuthenticationService]
})
export class HomeComponent implements OnInit {

  afuConfig = {
    uploadAPI: {
      url:"http://localhost:5001/pinfbet-10a92/us-central1/api/prueba",
      responseType: 'arraybuffer'
    }
  };


  constructor(public auth: AuthenticationService, private router: Router, private httpClient: HttpClient) {}

  async ngOnInit() {
    let user = await this.auth.getCurrentUser();
    // if(!user) {
    //   this.router.navigate(['login']);
    // }
    let token = await user?.getIdToken();
    let tokenString = "Bearer " + token;
    
    // this.httpClient.get(environment.url + "/prueba ", {headers: {'Authorization': tokenString}})
    // .subscribe(
    //   (response) => {   // data is already a JSON object
    //      console.log(response);
    //   }
    // );

    this.httpClient.post(environment.url + "/userstatus ", "hola", {headers: {'Authorization': tokenString}})
    .subscribe(
      (response) => {   // data is already a JSON object
         console.log(response);
      }
    );
  }

}

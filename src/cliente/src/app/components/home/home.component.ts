import { HttpClient } from '@angular/common/http';
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
    // const user = await this.auth.getCurrentUser();
    // if(!user) {
    //   this.router.navigate(['login']);
    // }
    this.httpClient.get("http://localhost:5001/pinfbet-10a92/us-central1/api/prueba")
    .subscribe(
      (response) => {   // data is already a JSON object
         console.log(response);
      }
    );
  }

}

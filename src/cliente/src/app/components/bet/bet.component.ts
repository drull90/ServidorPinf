import { Component, OnInit } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from '../service/authentication.service';



@Component({
  selector: 'app-bet',
  templateUrl: './bet.component.html',
  styleUrls: ['./bet.component.css']
})
export class BetComponent implements OnInit {

  token: string = "";
  apuestas: any = [];


  constructor(public auth: AuthenticationService, private router: Router, private httpClient: HttpClient) { }
  
  async ngOnInit() {
    
      let user= await this.auth.getCurrentUser();
      let token = await user?.getIdToken();
      let tokenString = "Bearer " + token;
      this.token = tokenString;

      this.httpClient.get(environment.url + "/apuestas", {headers: {'Authorization': tokenString}})
      .subscribe(
        (response: any) => {
          this.apuestas = response.data;

          console.log(this.apuestas);
        }
      );
    }

}

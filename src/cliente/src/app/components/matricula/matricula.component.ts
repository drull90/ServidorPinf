import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-matricula',
  templateUrl: './matricula.component.html',
  styleUrls: ['./matricula.component.css']
})
export class MatriculaComponent implements OnInit {

  data: any = [];
  token: string = "";

  constructor(public auth: AuthenticationService, private router: Router, private httpClient: HttpClient) { }


  async ngOnInit(){

    let user= await this.auth.getCurrentUser();
    let token = await user?.getIdToken();
    let tokenString = "Bearer" + token;
    this.token = tokenString;

    this.httpClient.get(environment.url + "/matricula", {headers: {'Authorization': tokenString}})
    .subscribe(
      (response: any) => {
        this.data = response.data;

        console.log(this.data);
      }
    );
  }

}

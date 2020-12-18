import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';

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

  constructor(public auth: AuthenticationService, private router: Router) {}

  async ngOnInit() {
    // const user = await this.auth.getCurrentUser();
    // if(!user) {
    //   this.router.navigate(['login']);
    // }
  }

}

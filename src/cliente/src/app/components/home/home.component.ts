import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [AuthenticationService]
})
export class HomeComponent implements OnInit{

  constructor(public auth: AuthenticationService, private router: Router) {}

  async ngOnInit() {
    const user = await this.auth.getCurrentUser();
    if(!user) {
      this.router.navigate(['login']);
    }
  }

}

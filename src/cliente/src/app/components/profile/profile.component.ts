import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from '../service/authentication.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  userUID: String = "";

  constructor(public auth: AuthenticationService, private router: Router, private httpClient: HttpClient, private activatedRoute: ActivatedRoute) { }

  async ngOnInit() {

    let user = await this.auth.getCurrentUser();
    let token = await user?.getIdToken();
    let tokenString = "Bearer " + token;

    this.activatedRoute.paramMap.subscribe(params => {
      let nick = params.get("userid");
      if(nick) {
        this.userUID = nick;
      }
    });

  }

}

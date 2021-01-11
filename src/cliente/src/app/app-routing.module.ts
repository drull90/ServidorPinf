import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
<<<<<<< HEAD
import { AboutUsComponent } from './components/about-us/about-us.component';
import { BetComponent } from './components/bet/bet.component';
import { ContactComponent } from './components/contact/contact.component';
=======
import { ForoComponent } from './components/foro/foro.component';
>>>>>>> 6140eaee7e3e72861f73f8bf585821609f7ccc63
import { FriendsComponent } from './components/friends/friends.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    component: HomeComponent
  },
  {
    path: 'register',
    component: RegisterComponent
  },
  {
    path: 'friends',
    component: FriendsComponent
  },
  {
<<<<<<< HEAD
    path: 'contact',
    component: ContactComponent
  },
  {
    path: 'aboutus',
    component: AboutUsComponent
  },
  {
    path: 'bet',
    component: BetComponent
=======
    path: 'profile/:userid',
    component: ProfileComponent
  },
  {
    path: 'foro',
    component: ForoComponent
>>>>>>> 6140eaee7e3e72861f73f8bf585821609f7ccc63
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
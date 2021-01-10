import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ForoComponent } from './components/foro/foro.component';
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
    path: 'profile/:userid',
    component: ProfileComponent
  },
  {
    path: 'foro',
    component: ForoComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
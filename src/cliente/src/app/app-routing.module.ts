import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { BetComponent } from './components/bet/bet.component';
import { ContactComponent } from './components/contact/contact.component';
import { FriendsComponent } from './components/friends/friends.component';
import { HomeComponent } from './components/home/home.component';
import { LoginComponent } from './components/login/login.component';
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
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
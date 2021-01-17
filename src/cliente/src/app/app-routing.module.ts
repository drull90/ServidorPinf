import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { ApuestaComponent } from './components/apuesta/apuesta.component';
import { BetComponent } from './components/bet/bet.component';
import { ContactComponent } from './components/contact/contact.component';
import { ExpedienteComponent } from './components/expediente/expediente.component';
import { ForoComponent } from './components/foro/foro.component';
import { FriendsComponent } from './components/friends/friends.component';
import { LandingPageComponent } from './components/landing-page/landing-page.component';
import { LoginComponent } from './components/login/login.component';
import { MatriculaComponent } from './components/matricula/matricula.component';
import { MiPerfilComponent } from './components/mi-perfil/mi-perfil.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { ResponibilityStatementComponent } from './components/responibility-statement/responibility-statement.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
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
  },
  {
    path: 'foro',
    component: ForoComponent
  },
  {
    path: 'profile/:userid',
    component: ProfileComponent
  },
  {
    path: 'expediente',
    component: ExpedienteComponent
  },
  {
    path: 'matricula',
    component: MatriculaComponent
  },
  {
    path: 'miperfil',
    component: MiPerfilComponent
  },
  { 
    path: 'apuesta/:uid/:codigo',
    component: ApuestaComponent  
  },
  {
    path: 'responsibility-statement',
    component: ResponibilityStatementComponent
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent
  },
  {
    path: '',
    component: LandingPageComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
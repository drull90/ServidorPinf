import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { RegisterComponent } from './components/register/register.component';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from 'src/environments/environment';
import { AuthenticationService } from './components/service/authentication.service';
import { LoginComponent } from './components/login/login.component';
import { AngularFileUploaderModule } from "angular-file-uploader";
import { HttpClientModule } from '@angular/common/http';
import { FriendsComponent } from './components/friends/friends.component';
import { ProfileComponent } from './components/profile/profile.component';
import { ForoComponent } from './components/foro/foro.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatriculaComponent } from './components/matricula/matricula.component';
import { ExpedienteComponent } from './components/expediente/expediente.component';
import { BetComponent } from './components/bet/bet.component';
import { ApuestaComponent } from './components/apuesta/apuesta.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    FriendsComponent,
    ProfileComponent,
    ForoComponent,
    MatriculaComponent,
    ExpedienteComponent,
    BetComponent,
    ApuestaComponent
  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebase),
    BrowserModule,
    AppRoutingModule,
    AngularFireAuthModule,
    AngularFileUploaderModule,
    HttpClientModule,
    MatCardModule,
    MatButtonModule,
    ReactiveFormsModule
  ],
  providers: [AuthenticationService],
  bootstrap: [AppComponent]
})
export class AppModule { }

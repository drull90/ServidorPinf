import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-apuesta',
  templateUrl: './apuesta.component.html',
  styleUrls: ['./apuesta.component.css']
})
export class ApuestaComponent implements OnInit {


  constructor() { }

  formularioApuesta = new FormGroup({
    Calificacion: new FormControl('', Validators.required),
    Estado: new FormControl('', Validators.required),
    PinfCoinsApostados: new FormControl('', Validators.required)
  })

  onSubmit()
  {
      alert(JSON.stringify(this.formularioApuesta.value))
  }

  ngOnInit(): void {
  }

}

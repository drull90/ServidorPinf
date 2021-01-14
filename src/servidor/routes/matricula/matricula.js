'use strict'

let admin = require("../../firebase/firebaseAdmin");

let database = admin.dataBase;
let firebase = admin.firebaseAdmin.firestore;

var pdfReader = require("pdfreader");

var rows = [];
var codigos = [];
var nombres = [];
var asignaturas = [];

async function getMatricula(req, res)
{
  try{
    let uid = req.user.uid;
    
    let data = {
      data: []
    };

    let matricula = await database.collection('matricula').doc(uid).get();

    matricula = matricula.data();

    let keys = Object.keys(matricula);

    for(let i = 0; i < keys.length; ++i ) {
      let asignatura = await getDatosAsignatura(keys[i]);

      if(asignatura !== {}) {

        let apuestasRecibidas = Object.keys(matricula[keys[i]]);

        asignatura.apuestas = apuestasRecibidas.length;

        data.data.push(asignatura);
      }
 
    }

    res.status(200).send(data);
  }
  catch(error) {
    console.log(error);
    res.status(500).send('{ "message": "' + error + '" } ');
  }
}

async function getDatosAsignatura(codigo) {

  let data = {};
  let asignatura = await database.collection('asignaturas').doc(codigo).get();

  asignatura = asignatura.data();

  if(asignatura !== undefined ) {
    data = {
      codigo: codigo,
      nombre: asignatura.nombre
    }
  }

  return data;
}


function analizarMatricula() {

  //Bucle que determina la parte del código de asignatura que todas comparten. En el caso del pdf-matrícula 
  //se encuentra después de la linea Cv (a diferencia del expediente que se encontraba en "Asignaturas Matriculadas:")
  for(let i = 0; i <= rows.length ; i++){
    if(rows[i] == "Cv"){                    
      var precod = rows[i+1].substr(0,4);
    }
  }
  
  //Como la información de asignaturas no viene recogida en una misma linea en este formato de PDF usando las herramientas de PDFReader
  //en primer lugar recogemos los códigos presentes en el archivo (asignaturas matriculadas) y se almacena en el array de codigos[]
  for(let i = 0; i <= rows.length ; i++){
    if(rows[i] != null){
      if(rows[i].match(precod)){
        codigos.push(rows[i]);
      }
    }
  }

  //En este bucle, se calcula la posición de la línea donde se encuentra el nombre de cada código anteriormente leído y lo almacena en nombres[]
  //DISCLAIMER: Esto solo sería valido para recibos de matrículas generados con el formato que utiliza la Universidad de Cádiz a fecha del curso 2020/2021
  for(let i = 0; i <= rows.length ; i++){
    if(rows[i] != null){
      if(rows[i].match(precod)){
        nombres.push(rows[i+(10*codigos.length)]);
      }
    }
   }

  //Genera un nuevo array definitivo con cada código concatenado con su nombre de asignatura. Nos servirá para tratar con dicha información.
  for(let i = 0 ; i <= codigos.length ; i++){
    let str1 = codigos[i];
    let str2 = nombres[i];
    if(str1 != null){
      asignaturas.push(str1.concat(" ", str2));
    }
  }
  
}

async function subirMatriculaConPDF(){

  new pdfReader.PdfReader().parseFileItems("ruta_al_PDFMatrícula", function(err, item) {  //Duda incluir path al pdf que sube el usuario
    if (!item ){
      analizarMatricula(); 
    }
    else if(item.text) 
    {
      rows.push(item.text);
    }
  });

  for(let i = 0 ; i <= asignaturas.length ; i++){
   
    if(asignaturas[i] != null){
      let l = asignaturas[i].split(" ");
      let codigo = l[0];
      let nombre = nombres[i];

      const userMatRef = db.collection('matricula').doc(usuario);
      const asignaturaRef = db.collection('asignaturas').doc(codigo);

      const a = await userMatRef.set({
        "codigo": codigo
      },{ merge: true });

      const b =  await asignaturaRef.set({
        "nombre": nombre
      },{merge: true });
 
    }
  }
}

module.exports = {
  getMatricula
}
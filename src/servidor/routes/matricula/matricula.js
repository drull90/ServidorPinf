'use strict'

let admin = require("../../firebase/firebaseAdmin");

let database = admin.dataBase;

let pdfReader = require("pdfreader");

async function subirMatriculaManual(req,res) {
  try {

    let uid = req.user.uid;

    let cod = req.body.codigo;
    let nom = req.body.nombre;

  
  
    res.status(200).send('{ "done" }');

  } catch (error) {
    console.log(error);
    res.status(500).send('{ "message": "' + error + '" } ');  }
}

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

function analizarMatricula(pdfArray) {

  let precod;
  let codigos = [];
  let nombres = [];
  let asignaturas = [];

  //Bucle que determina la parte del código de asignatura que todas comparten. En el caso del pdf-matrícula 
  //se encuentra después de la linea Cv (a diferencia del expediente que se encontraba en "Asignaturas Matriculadas:")
  for(let i = 0; i <= pdfArray.length ; i++){
    if(pdfArray[i] == "Cv"){                    
      precod = pdfArray[i+1].substr(0,4);
    }
  }
  
  //Como la información de asignaturas no viene recogida en una misma linea en este formato de PDF usando las herramientas de PDFReader
  //en primer lugar recogemos los códigos presentes en el archivo (asignaturas matriculadas) y se almacena en el array de codigos[]
  for(let i = 0; i <= pdfArray.length ; i++){
    if(pdfArray[i] != null){
      if(pdfArray[i].match(precod)){
        codigos.push(pdfArray[i]);
      }
    }
  }

  //En este bucle, se calcula la posición de la línea donde se encuentra el nombre de cada código anteriormente leído y lo almacena en nombres[]
  //DISCLAIMER: Esto solo sería valido para recibos de matrículas generados con el formato que utiliza la Universidad de Cádiz a fecha del curso 2020/2021
  for(let i = 0; i <= pdfArray.length ; i++){
    if(pdfArray[i] != null){
      if(pdfArray[i].match(precod)){
        nombres.push(pdfArray[i+(10*codigos.length)]);
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

  let data = {
    codigo: codigos,
    nombres: nombres
  }
  
  return data;
}

function getFileFromClient(byteArray) {
  let promise = new Promise(function(resolve, reject) {
      var pdfString = [];
      new pdfReader.PdfReader().parseBuffer(byteArray, function (err, item) {
          if (err) console.log("PDF READER ERROR: " + err);
          else if (!item) resolve(pdfString);
          else if (item.text) pdfString.push(item.text);
      });
  });

  return promise;
}

async function subirMatricula(req, res) {
  try {
    let uid = req.user.uid;

    let pdfStringArray = await getFileFromClient(req.body);

    let data = analizarMatricula(pdfStringArray);

    // Meter en asignaturas las asignaturas que no existan

    // Actualizar expediente antes que la matricula

    res.status(200).send('{ "message": "Matricula subida correctamente" }');
  }
  catch(error) {
    console.log(error);
    res.status(500).send('{ "message": "' + error + '" } ');
  }


}

module.exports = {
  getMatricula,
  subirMatricula,
  subirMatriculaManual
}
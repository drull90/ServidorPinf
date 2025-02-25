'use strict'

let admin = require("../../firebase/firebaseAdmin");
let database = admin.dataBase;
let pdfReader = require("pdfreader");

async function subirMatriculaManual(req,res) {
  try {
    let uid = req.user.uid;
    let cod = req.body.codigo;

    if(cod !== undefined) {

      // Miramos si tenemos la asignatura guardada
      let asignatura = await database.collection('asignaturas').doc(cod).get();
      asignatura = asignatura.data();

      if(asignatura !== undefined) { // La asignatura esta guardada

        // Si esta en expediente, echarlo, si no continuar

        let expediente = await database.collection('expedientes').doc(uid).get();
        expediente = expediente.data();

        let existeExpediente = false;
        if(expediente !== undefined) {
          if(expediente[cod] !== undefined) {
            existeExpediente = true;
          }
        }

        if(!existeExpediente) {

          let matricula = await database.collection('matricula').doc(uid).get();
          matricula = matricula.data();

          let data = {};
          data[cod] = {};

          if(matricula !== undefined) { // Hay algo en matricula
            if(matricula[cod] === undefined) { // No existe, guardamos
              await database.collection('matricula').doc(uid).set(data, {merge: true});
              res.status(200).send('{ "message": "Asignatura ' + asignatura.nombre + ' correctamente subida" } ');
            }
            else { // Ya existe
              res.status(400).send('{ "message": "Asignatura ' + asignatura.nombre + ' ya existe en matricula" } ');
            } 
          }
          else { // No hay nada en matricula, guardamos
            await database.collection('matricula').doc(uid).set(data, {merge: true});
            res.status(200).send('{ "message": "Asignatura ' + asignatura.nombre + ' correctamente subida" } ');
          }
        }
        else {
          res.status(400).send('{ "message": "Asignatura ' + asignatura.nombre + ' ya existe en expediente" } ');
        }

      }
      else { // Aun no tenemos la asignatura guardada
        res.status(400).send('{ "message": "Aun no tenemos la asignatura guardada en la base de datos, se paciente, en breves la tendremos" } ');
      }

    }
    else {
      res.status(400).send('{ "message": "Codigo introducido invalido" } ');
    } 

  } catch (error) {
    console.log(error);
    res.status(500).send('{ "message": "' + error + '" } ');  
  }
}

async function getAsignatura(req,res)
{
  try {
    let codigo = req.params.cod;

    let data = {
        nombre: null
    }

    let asignatura = await database.collection('asignaturas').doc(codigo).get();
    asignatura = asignatura.data();

    if(asignatura !== undefined)
    {
        data.nombre = asignatura.nombre;
        res.status(200).send(data);
    }
    else{
        res.status(400).send('{ "message": "La asignatura no existe" }');
    }
}
catch(error){
    console.log(error);
    res.status(500).send('{ "message": "' + error + '" }');
}
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

    if(matricula !== undefined) {
      let keys = Object.keys(matricula);

      for(let i = 0; i < keys.length; ++i ) {
        let asignatura = await getDatosAsignatura(keys[i]);

        if(asignatura !== {}) {

          let apuestasRecibidas = Object.keys(matricula[keys[i]]);

          asignatura.apuestas = apuestasRecibidas.length;

          data.data.push(asignatura);
        }
  
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

    // Miramos si esta actualizando o guardando matricula
    let matricula = await database.collection('matricula').doc(uid).get();
    matricula = matricula.data();

      let keys = [];
    if(matricula !== undefined) {
      keys = Object.keys(matricula);
    }
    
    if(matricula === undefined || keys.length === 0) { // No hay datos en matricula, esta guardandolo
      await guardarMatricula(uid, data);
      res.status(200).send('{ "message": "Matricula subida correctamente" }');
    }
    else { // Tiene que actualizar el expediente antes
      res.status(400).send('{ "message": "Porfavor, actualice su expediente primero para que los usuarios puedan obtener resultados en sus apuestas" }');
    }
    
  }
  catch(error) {
    console.log(error);
    res.status(500).send('{ "message": "' + error + '" } ');
  }

}

async function guardarMatricula(uid, data) {

  let datos = data;

  // Meter en asignaturas las asignaturas que no existan
  for(let i = 0; i < datos.codigo.length; ++i) {
    let codigoAsig = datos.codigo[i];

    let asignatura = await database.collection('asignaturas').doc(codigoAsig).get();
    asignatura = asignatura.data();

    if(asignatura === undefined) { // No existe la asignatura
      let dataAsig = {
        nombre: datos.nombres[i]
      };

      await database.collection('asignaturas').doc(codigoAsig).set(dataAsig);
    }

    // Guardamos la asignatura en la matricula del usuario
    let dataAsig = {};
    dataAsig[codigoAsig] = {};
    await database.collection('matricula').doc(uid).set(dataAsig, {merge: true});
  } 

}

module.exports = {
  getMatricula,
  subirMatricula,
  subirMatriculaManual,
  getAsignatura
}
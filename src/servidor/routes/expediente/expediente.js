'use strict'

let admin = require("../../firebase/firebaseAdmin");

let database = admin.dataBase;

let pdfReader = require("pdfreader");

async function subirExpedienteManual(req, res){
  try{

    let uid = req.user.uid;

    let cod = req.body.codigo;
    let nom = req.body.nombre;
    let cal = req.body.calificacion;
    

    res.status(200).send('{ "done" }');
  }
  catch(error){
    console.log(error);
    res.status(500).send('{ "message": "' + error + '" }');
  }
}

async function getExpediente(req, res)
{
  try{

    let uid = req.user.uid;

    let data = {
      data: []
    };

    let expediente = await database.collection('expedientes').doc(uid).get();
    expediente = expediente.data();

    if(expediente !== undefined) {
      let keys = Object.keys(expediente); //Codigos asignaturas

      for(let i = 0; i < keys.length; ++i) {
        let asignatura = await getDatosAsignatura(keys[i]);
        let asigData = {
          codigo: asignatura.codigo,
          nombre: asignatura.nombre,
          calificacion: expediente[keys[i]].calificacion
        }
        data.data.push(asigData);
      }
    }   

    res.status(200).send(data);
  }
  catch(error)
  {
    console.log(error);
    res.status(500).send('{ "message": "' + error + '" } ');  }
}


async function getDatosAsignatura(codigo)
{
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

function getAsignaturasAprobadas(pdfArray) {
  let precod = null;
  let asignaturas = [];
  for (let i = 1; i <= pdfArray.length; i++) {
      if (pdfArray[i] == "Asignaturas Matriculadas:") {
          precod = pdfArray[i + 1].substr(0, 5);   //Toma como referencia la parte común del código de todas las asignaturas
      }
  }

  for (let i = 1; i <= pdfArray.length; i++) {
      if (pdfArray[i] != null) {
          if (pdfArray[i].match(precod)) { //Analiza las lineas del pdf que continene una asignatura
              let linea = pdfArray[i].split(" ");
              if (parseFloat(linea[linea.length - 2]) >= 5) { //Si la asignatura está aprobada (calificación >= 5.0) se almacena
                  asignaturas.push(pdfArray[i]);
              }
          }
      }
  }
  return asignaturas;
}

function getNombreAsignatura(asignatura) {
  let nombre = "";
  for(let i = 2; i < asignatura.length ; ++i){
    if(isNaN(asignatura[i])){
      nombre = nombre + " " + asignatura[i];
    }
    else{
      break;
    }

  }

  nombre = nombre.substring(1, nombre.length);

  return nombre;
}

function obtenerPinfCoins(pdfArray, asignaturas) {
  for (let i = 0; i <= pdfArray.length; i++) { //Bucle para obtener la nota media del alumno
      if (pdfArray[i] != null) {
          if (pdfArray[i].match("NOTA MEDIA PONDERADA")) {
              if (pdfArray[i + 1].match("Art. 5.3 del R.D. 1125/2003")) {
                  let linea = pdfArray[i].split(" ");
                  var NotaMedia = parseFloat(linea[4].substr(0, 4));
              }
          }
      }
  }

  for (let i = 0; i <= asignaturas.length; i++) { //Bucle para obtener el total de créditos superados por el alumno
      if (asignaturas[i] != null) {
          let linea = asignaturas[i];
          var creditosSuperados = + parseInt((linea[67]));
      }
  }

  //console.log("PinfCoins: " + creditosSuperados * NotaMedia); //PinfCoins = creditosSuperados * NotaMedia en base 10
  return (creditosSuperados * NotaMedia); 
}

async function subirExpediente(req, res) {
  try {
    let uid = req.user.uid;

    let pdfStringArray = await getFileFromClient(req.body);
    let asignaturasAprobadas = getAsignaturasAprobadas(pdfStringArray);

    // Miramos si esta actualizando o guardando expediente
    let expediente = await database.collection('expedientes').doc(uid).get();
    expediente = expediente.data();

    let keys = Object.keys(expediente);
    if(expediente === undefined || keys.length === 0) { // No hay datos en expediente, esta guardandolo
      await guardarExpediente(uid, asignaturasAprobadas, pdfStringArray);
      res.status(200).send('{ "message": "Expediente subid correctamente" }');
    }
    else {
      await actualizarExpediente(uid, asignaturasAprobadas, pdfStringArray);
      res.status(200).send('{ "message": "Expediente actualizado correctamente" }');
    }

    
  }
  catch(error) {
    console.log(error);
    res.status(500).send('{ "message": "' + error + '" } ');
  }
}

async function guardarExpediente(uid, asignaturasAprobadas, pdfStringArray) {

  let asignatura, calificacion, nombre, codigo, coins, coinsTotalesConseguidos = 0;

  for (let i = 0; i <= asignaturasAprobadas.length; ++i) {
    if (asignaturasAprobadas[i] != null) {

      asignatura = asignaturasAprobadas[i].split(" ");
      calificacion = asignatura[asignatura.length - 2];
      nombre = getNombreAsignatura(asignatura);
      codigo = asignatura[1];
      coins = obtenerPinfCoins(pdfStringArray, asignaturasAprobadas);
      coinsTotalesConseguidos += coins;

      // Buscamos la asignatura actual en la db, si esta, no hacemos nada, si no, la agregamos
      let asig = await database.collection('asignaturas').doc(codigo).get();
      asig = asig.data();

      if(asig === undefined) { // La asignatura no existe, la guardamos
        await database.collection('asignaturas').doc(codigo).set({nombre: nombre});
      }

      // Guardamos en el expediente los datos
      let expediente = {};
      expediente[codigo] = {
        calificacion: calificacion
      };

      await database.collection('expedientes').doc(uid).set(expediente, {merge: true});
    }
  }

  // Actualizar pinfcoins del usuario (Van a ser 0 siempre)
  await database.collection('usuarios').doc(uid).update({
    pinfcoins: coinsTotalesConseguidos
  });

}

async function actualizarExpediente() {

  // Fuck it

}

module.exports = {
  subirExpediente,
  getExpediente,
  subirExpedienteManual
}
'use strict'

const { database } = require("firebase-admin");
const { ConsoleReporter } = require("jasmine");
var pdfReader = require("pdfreader");

let admin = require("../../firebase/firebaseAdmin");
let firebase = admin.firebaseAdmin.firestore;

let dataBase = admin.dataBase;

async function getExpediente(req, res)
{
  try{
    let uid = req.user.uid;

    let data = {
      data: [];
    };

    let expediente = await database.collection('expediente').doc(uid).get();
    expediente = expediente.data();

    if(expediente){
      let arr = Object.keys(expediente);
      for(let i = 0; i < arr.length; i++)
      {
        let user = //terminar
      }
    }

    res.status(200).send(data);
  }
  catch(error)
  {
    console.log(error);
    res.status(500).send('{ "message": "' + error + '" } ');
  }
}

function analizarExpediente() {

  for(let i = 1; i <= rows.length ; i++){

    if(rows[i] == "Asignaturas Matriculadas:"){  
      var precod = rows[i+1].substr(0,5);   //Toma como referencia la parte común del código de todas las asignaturas
    }
  }

  for(let i = 1; i <= rows.length ; i++){
    if(rows[i] != null){
      if(rows[i].match(precod)){ //Analiza las lineas del pdf que continene una asignatura
        let linea = rows[i].split(" ");
        if(parseFloat(linea[linea.length - 2]) >= 5){ //Si la asignatura está aprobada (calificación >= 5.0) se almacena
          asignaturas.push(rows[i]); 
        } 
     }
   }
  }
}

function ObtenerPinfCoins(){

  for(let i = 0; i<= rows.length ; i++){ //Bucle para obtener la nota media del alumno
    if(rows[i] != null){
      if(rows[i].match("NOTA MEDIA PONDERADA")){
        if(rows[i+1].match("Art. 5.3 del R.D. 1125/2003")){
          let linea = rows[i].split(" ");
          var NotaMedia = parseFloat(linea[4].substr(0,4));
        }
      }
    }
  }

  for(let i = 0; i <= asignaturas.length ; i++){ //Bucle para obtener el total de créditos superados por el alumno
    if(asignaturas[i] != null){
      let linea = asignaturas[i];
      var creditosSuperados =+ parseInt((linea[67]));
    }
  }

  //console.log("PinfCoins: " + creditosSuperados * NotaMedia); //PinfCoins = creditosSuperados * NotaMedia en base 10
  return (creditosSuperados * NotaMedia); 

}

function getNombre(string){
  let str = string.split(" ");
  let nombre = "";
  for(let i = 1; i < str.length ; i++){
    let num = str[i];

    if(isNaN(num)){
      nombre = nombre + " " + str[i];
    }
    else{
      break;
    }

  }
  return nombre;
}

async function subirExpedienteConPDF(){
  
  new pdfReader.PdfReader().parseFileItems("/ruta_al_pdfExpediente", function(err, item) {  //Duda incluir path al pdf que sube el usuario
    if (!item ){
      analizarExpediente();
    }
    else if(item.text) 
    {
      rows.push(item.text);
    }
   });

   for(let i = 0; i <= asignaturas.length ; i++){
    if(asignaturas[i] != null){
      var l = asignaturas[i].split(" ");
      var calificacion = l[l.length - 2];
      var nombre = getNombre(asignaturas[i]);
      var cod = l[1];
      var coins = ObtenerPinfCoins();
      console.log("PinfCoins")
    
  
    
     const userExRef = db.collection('expedientes').doc(usuario); 
     const asigRef = db.collection('asignaturas');
     const userRef = db.collection('usuarios').doc(usuario);

     const a = await userExRef.set({
       "codigo": cod,
       "calificacion": calificacion
     },{ merge: true });


     const b = await asigRef.set({
       "codigo": cod,
       "nombre": nombre
     },{ merge: true });

     const c = await userRef.update({"pinfcoins": coins});
    }
    }   
}
/////////////////////////////////////////////////////////////  Nuevo

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


function prueba(req, res) {
  cors(req, res, async () => {

    //firebase admin get user uid

    let pdfStringArray = await getFileFromClient(req.body);
    let asignaturasAprobadas = getAsignaturasAprobadas(pdfStringArray);

    let asignatura, calificacion, nombre, codigo, coins, coinsTotalesConseguidos = 0;

    const userExRef = database.collection('expedientes').doc(usuario);
    const asigRef = database.collection('asignaturas');
    const userRef = database.collection('usuarios').doc(usuario);

    // Leer el expediente que tiene, agregar las asignaturas nuevas

    // eleiminatlas de asignaturasAprobadas 

    for (let i = 0; i <= asignaturasAprobadas.length; ++i) {
      if (asignaturasAprobadas[i] != null) {

        asignatura = asignaturasAprobadas[i].split(" ");
        calificacion = asignatura[asignatura.length - 2];
        nombre = getNombreAsignatura(asignatura);
        codigo = asignatura[1];
        coins = obtenerPinfCoins(pdfStringArray, asignaturasAprobadas);
        coinsTotalesConseguidos += coins;
        
        let expediente = {};
        expediente[codigo] = {
          "nombre": nombre
        };


        //await userExRef.set(expediente, { merge: true });

        // Si no existe, meter la asignatura
        //await asigRef.doc(codigo).set({ "nombre": nombre });
  
      }
    }

    //await userRef.update({ "pincoins": coins }); // Actualizar sus pinfocns

    res.status(200).send("holas");
  })
}

module.exports = {
  prueba,
  getExpediente
}
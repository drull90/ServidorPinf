'use strict'

let admin = require("../../firebase/firebaseAdmin");
let database = admin.dataBase;
let pdfReader = require("pdfreader");
let firebase = admin.firebaseAdmin.firestore;

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
      res.status(200).send('{ "message": "Expediente subido correctamente" }');
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
      calificacion = parseInt(asignatura[asignatura.length - 2]);
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

async function actualizarExpediente(uid, asignaturasAprobadas, pdfStringArray) {

    //Obtengo el expediente actual del usuario
    let expedienteActual = await database.collection('expedientes').doc(uid).get();
    expedienteActual = expedienteActual.data();

    let keysAntiguas, keysExpediente = [], keysNuevas, coinsTotalesConseguidos = 0;

    keysAntiguas = Object.keys(expedienteActual);

    //Asignamos pinfcoins a asignaturas que sean nuevas en el expediente
    for (let i = 0; i <= asignaturasAprobadas.length; ++i) {
        if (asignaturasAprobadas[i] != null) {

        let asignatura = asignaturasAprobadas[i].split(" ");

        let calificacion = parseInt(asignatura[asignatura.length - 2]);
        let nombre = getNombreAsignatura(asignatura);
        let codigo = asignatura[1];

        keysExpediente.push(codigo);

        //Si la asignatura esta en el expediente antiguo, no sumar coins
        let existe = keysAntiguas.includes(codigo);

        if(!existe) { 
            let coins = obtenerPinfCoins(pdfStringArray, expedienteActual);
            coinsTotalesConseguidos += coins;

            // Guardamos en el expediente los datos
            let expediente = {};
            expediente[codigo] = {
            calificacion: calificacion
            };
            await database.collection('expedientes').doc(uid).set(expediente, {merge: true});
        }
    
        // Buscamos la asignatura actual en la db, si esta, no hacemos nada, si no, la agregamos
        let asig = await database.collection('asignaturas').doc(codigo).get();
        asig = asig.data();

        if(asig === undefined) { // La asignatura no existe, la guardamos
            await database.collection('asignaturas').doc(codigo).set({nombre: nombre});
        }

        }
    }

    let keysDifference = keysExpediente.filter(x => !keysAntiguas.includes(x)); // Todas los codigos de asignaturas nuevas aprobadas

    //Por cada asignatura nueva aproabada
    //  - Busco el codigo en matricula
    //  - Si existe
    //      - Si contiene apuestas
    //          - Obtengo id usuarios que han apostado, e id apuesta
    //          - Por cada usuario
    //              - Copio la apuesta a historial de apuesta (sin borrar de apuestas)
    //              - Borro la apuesta de apuestas activas
    //              - Asigno pinfcoins si ha acertado (aprobar, nota)
    //              - Actualizo perfil, +1 acierto o +1 fallo
    //              - Actualizo perfil pinfcoinsGanados
    //     - Borro la entrada en matricula

    //Por cada entrada restante en matricula (Suponemos han sido suspendidas)
    //  - Obtengo id usuario que hayan apostado e id apuesta
    //  - Por cada usuario
    //      - Copio la apuesta a historial de apuesta
    //      - Borro la apuesta de apuestas activas
    //      - Asigno pinfcoins si ha acertado (suspenso, nota)
    //      - Actualizo perfil, +1 acierto o +1 fallo
    //      - Actualizo perfil pinfcoinsGanados
    //  - Borro la entrada en matricula


    let matricula = await database.collection('matricula').doc(uid).get();
    matricula = matricula.data(); // Obtenemos la matricula del alumno

    if(matricula !== undefined) { // Si tiene algo en matriculas

        for(let i = 0; i < keysDifference.length; ++i) { // Por cada asignatura nueva obtenemos las apuestas
            let codigo = keysDifference[i];

            if(matricula[codigo] !== undefined) {
                let apuestas = matricula[codigo];
                let keys = Object.keys(apuestas); // Obtenemos el numero de apuestas en la asignatura actual

                for(let i = 0; i < keys.length; ++i) { // Obtenemos el id de usuario y apuesta de cada apuesta en la asignatura
                    let userId = keys[i];
                    let apuestaId = apuestas[keys[i]];

                    //Obtenemos los datos de la apuesta
                    let apuesta = await database.collection('apuestas').doc(apuestaId).get();
                    apuesta = apuesta.data();

                    //Obtenemos calificacion y estadoFin del expediente
                    let expedienteData = await database.collection('expedientes').doc(uid).get();
                    expedienteData = expedienteData.data();

                    let calificacionFin = expedienteData[codigo].calificacion;
                    let estadoFin = "";
                    if(calificacionFin >= 5) {
                        estadoFin = "Aprueba"
                    }
                    else {
                        estadoFin = "Suspende"
                    }

                    //Calculamos los pinfcoin ganados
                    let pinfcoinsApostados = apuesta.pinfCoins;
                    let pinfcoinsGanados = 0;
                    if(estadoFin === apuesta.estado) {
                        pinfcoinsGanados = pinfcoinsApostados * 1.2;
                    }
                    if(calificacionFin === apuesta.calificacion) {
                        pinfcoinsGanados += pinfcoinsApostados * 1.5;
                    }

                    //Copiamos la apuesta al historial de apuesta
                    let data = {};
                    data[apuestaId] = {
                        destinatario: uid,
                        estado: apuesta.estado,
                        calificacion: apuesta.calificacion,
                        estadoFin: estadoFin,
                        calificacionFin: calificacionFin,
                        pinfCoinsGanados: pinfcoinsGanados
                    };
                    await database.collection('historialApuestas').doc(userId).set(data, {merge: true});

                    //Borramos apuesta de apustas activas
                    let str = "apuestasActivas." + apuestaId;
                    await database.collection('usuarios').doc(userId).update({
                        [str]: firebase.FieldValue.delete(),
                        pinfcoinsGanados: firebase.FieldValue.increment(pinfcoinsGanados),
                        pinfcoins: firebase.FieldValue.increment(pinfcoinsGanados)
                    });
                    
                }
            }

            // Borrar de matricula
            await database.collection('matricula').doc(uid).update({
                [codigo]: firebase.FieldValue.delete()
            });
        }

        // Las asignaturas que quedan, las volvemos a leer 
        matricula = await database.collection('matricula').doc(uid).get();
        matricula = matricula.data(); // Obtenemos la matricula del alumno

        if(matricula !== undefined) { //Aun hay datos en matricula

            let keys = Object.keys(matricula);
            for(let i = 0; i < keys.length; ++i) { //Por cada dato que quede
                let codigo = keys[i];

                if(matricula[codigo] !== undefined) { // Existe
                    let apuestas = matricula[codigo];
                    let apuestasKey = Object.keys(apuestas);

                    console.log(matricula[codigo]);

                    for(let j = 0; j < apuestasKey.length; ++j) { // Por cada apuesta en la asignatura

                        let userId = apuestasKey[j];
                        let apuestaId = apuestas[userId];

                        //Obtenemos los datos de la apuesta
                        let apuesta = await database.collection('apuestas').doc(apuestaId).get();
                        apuesta = apuesta.data();

                        let calificacionFin = 4;
                        let estadoFin = "Suspende";
                        
                        //Calculamos los pinfcoin ganados
                        let pinfcoinsApostados = apuesta.pinfCoins;
                        let pinfcoinsGanados = 0;

                        if(estadoFin === apuesta.estado) {
                            pinfcoinsGanados = pinfcoinsApostados * 1.2;
                        }
                        if(calificacionFin === apuesta.calificacion) {
                            pinfcoinsGanados += pinfcoinsApostados * 1.5;
                        }

                        //Copiamos la apuesta al historial de apuesta
                        let data = {};
                        data[apuestaId] = {
                            destinatario: uid,
                            estado: apuesta.estado,
                            calificacion: apuesta.calificacion,
                            estadoFin: estadoFin,
                            calificacionFin: calificacionFin,
                            pinfCoinsGanados: pinfcoinsGanados
                        };
                        await database.collection('historialApuestas').doc(userId).set(data, {merge: true});

                        //Borramos apuesta de apuestas activas
                        let str = "apuestasActivas." + apuestaId;
                        await database.collection('usuarios').doc(userId).update({
                            [str]: firebase.FieldValue.delete(),
                            pinfcoinsGanados: firebase.FieldValue.increment(pinfcoinsGanados),
                            pinfcoins: firebase.FieldValue.increment(pinfcoinsGanados)
                        });
                    }

                }

                // Borrar de matricula
                await database.collection('matricula').doc(uid).update({
                    [codigo]: firebase.FieldValue.delete()
                });

            }

        }

    }
  
}

module.exports = {
  subirExpediente,
  getExpediente,
  subirExpedienteManual
}
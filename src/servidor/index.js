'use strict'

require('dotenv').config();

const functions = require('firebase-functions');

const app = require('./routes/routes');

exports.api = functions.https.onRequest(app);

exports.userCreated = functions.auth.user().onCreate( async (user) => {

    console.log("Usuario creado =======>" + user);

});

// BORRAR

const admin = require("./firebase/firebaseAdmin");
let db = admin.dataBase;

async function crearDatosDePrueba() {

    // Crear usuario
    let data = {
        "nick": "drull90",
        "estado": "Apostando a tope",
        "fotoUrl": "z8JUgK1gH6fH4AXOH1hpuXNLDJx1-FOTO",
        "pinfcoins": 200,
        "verificado": true,
        "idioma": "es",
        "apuestasActivas": {
            "z8JUgK1gH6fH4AXOH1hpuXNLDJx1-HGFOTOEW-2007001": true,
            "z8JUgK1gH6fH4AXOH1hpuXNLDJx1-HGFOTOEW-2007002": true
        }
    };

    await db.collection('usuarios').doc('z8JUgK1gH6fH4AXOH1hpuXNLDJx1').set(data);

    data = {
        "nick": "rgued98",
        "estado": "Apostando a tope",
        "fotoUrl": "HGFOTOEW-FOTO",
        "pinfcoins": 3,
        "verificado": false,
        "idioma": "en"
    };

    await db.collection('usuarios').doc('HGFOTOEW').set(data);

    // Crear uuids

    data = {
        "uuid": "z8JUgK1gH6fH4AXOH1hpuXNLDJx1"
    };

    await db.collection('uuids').doc('@drull90').set(data);

    data = {
        "uuid": "HGFOTOEW"
    };

    await db.collection('uuids').doc('@rgued98').set(data);

    // crear asignaturas

    data = {
        "nombre": "IP"
    };

    await db.collection('asignaturas').doc('2007001').set(data);

    data = {
        "nombre": "PINF"
    };

    await db.collection('asignaturas').doc('2007002').set(data);

    data = {
        "nombre": "POO"
    };

    await db.collection('asignaturas').doc('2007003').set(data);

    // Crear estadisticas asignaturas

    data = {
        "2020": {
            "aprobados": 30,
            "suspensos": 10
        }
    };

    await db.collection('asignaturaEstadistica').doc('2007001').set(data);

    data = {
        "2020": {
            "aprobados": 30,
            "suspensos": 10
        }
    };

    await db.collection('asignaturaEstadistica').doc('2007002').set(data);

    // Crear expediente

    data = {
        "2007001": {
            "calificacion": 8
        },
        "2007002": {
            "calificacion": 7
        }
    };

    await db.collection('expedientes').doc('z8JUgK1gH6fH4AXOH1hpuXNLDJx1').set(data);

    data = {
        "2007001": {
            "calificacion": 8
        },
        "2007002": {
            "calificacion": 7
        }
    };

    await db.collection('expedientes').doc('HGFOTOEW').set(data);

    // crear matricula

    data = {
        "2007003": {
            "HGFOTOEW": true,
            "z8JUgK1gH6fH4AXOH1hpuXNLDJx1": true
        }
    };

    await db.collection('matricula').doc('z8JUgK1gH6fH4AXOH1hpuXNLDJx1').set(data);

    data = {
        "2007003": {
            "HGFOTOEW": true,
            "z8JUgK1gH6fH4AXOH1hpuXNLDJx1": true
        }
    };

    await db.collection('matricula').doc('HGFOTOEW').set(data);

    // crear amistades

    // data = {
    //     "HGFOTOEW": true
    // };

    // await db.collection('amistades').doc('z8JUgK1gH6fH4AXOH1hpuXNLDJx1').set(data);

    // data = {
    //     "z8JUgK1gH6fH4AXOH1hpuXNLDJx1": true
    // };

    // await db.collection('amistades').doc('HGFOTOEW').set(data);

    // crear peticiones enviadas

    data = {
        "HGFOTOEW": true
    };

    await db.collection('peticionesEnviadas').doc('z8JUgK1gH6fH4AXOH1hpuXNLDJx1').set(data);

    data = {
        "z8JUgK1gH6fH4AXOH1hpuXNLDJx1": true
    };

    await db.collection('peticionesEnviadas').doc('HGFOTOEW').set(data);

    // crear peticiones recibidas

    data = {
        "HGFOTOEW": true
    };

    await db.collection('peticionesRecibidas').doc('z8JUgK1gH6fH4AXOH1hpuXNLDJx1').set(data);

    data = {
        "z8JUgK1gH6fH4AXOH1hpuXNLDJx1": true
    };

    await db.collection('peticionesRecibidas').doc('HGFOTOEW').set(data);

    // crear apuestas

    data = {
        "usuario": "z8JUgK1gH6fH4AXOH1hpuXNLDJx1",
        "destinatario": "HQARWSE",
        "estado": "aprueba",
        "calificacion": 8
    };

    await db.collection('apuestas').doc('z8JUgK1gH6fH4AXOH1hpuXNLDJx1-HGFOTOEW-2007001').set(data);

    data = {
        "usuario": "z8JUgK1gH6fH4AXOH1hpuXNLDJx1",
        "destinatario": "HQARWSE",
        "estado": "aprueba",
        "calificacion": 8
    };

    await db.collection('apuestas').doc('z8JUgK1gH6fH4AXOH1hpuXNLDJx1-HGFOTOEW-2007002').set(data);

    data = {
        "usuario": "z8JUgK1gH6fH4AXOH1hpuXNLDJx1",
        "destinatario": "HQARWSE",
        "estado": "aprueba",
        "calificacion": 8
    };

    await db.collection('apuestas').doc('z8JUgK1gH6fH4AXOH1hpuXNLDJx1-z8JUgK1gH6fH4AXOH1hpuXNLDJx1-2007001').set(data);

    // crear estadisiticas

    data = {
        "apuestas": {
            "ganadas": 0,
            "perdidas": 0,
            "pinfcoinsGanados": 0,
            "pinfcoinsPerdidos": 0
        }
    };

    await db.collection('estadisticas').doc('z8JUgK1gH6fH4AXOH1hpuXNLDJx1').set(data);

    // crear historial apuestas

    data = {
        "z8JUgK1gH6fH4AXOH1hpuXNLDJx1-HGFOTOEW-2007005": {
            "destinatario": "HQWSSAZC",
            "estado": "aprueba",
            "calificacion": 8,
            "estadoFin": "aprobado",
            "calificacionFin": 5,
            "pinfcoinsGanados": 20
        },
        "z8JUgK1gH6fH4AXOH1hpuXNLDJx1-HGFOTOEW-2007006": {
            "destinatario": "HQWSSAZC",
            "estado": "aprueba",
            "calificacion": 8,
            "estadoFin": "aprobado",
            "calificacionFin": 5,
            "pinfcoinsGanados": 20
        }
    };

    await db.collection('historialApuestas').doc('z8JUgK1gH6fH4AXOH1hpuXNLDJx1').set(data);

    data = {
        "z8JUgK1gH6fH4AXOH1hpuXNLDJx1-HGFOTOEW-2007005": {
            "destinatario": "HQWSSAZC",
            "estado": "aprueba",
            "calificacion": 8,
            "estadoFin": "aprobado",
            "calificacionFin": 5,
            "pinfcoinsGanados": 20
        },
        "z8JUgK1gH6fH4AXOH1hpuXNLDJx1-HGFOTOEW-2007006": {
            "destinatario": "HQWSSAZC",
            "estado": "aprueba",
            "calificacion": 8,
            "estadoFin": "aprobado",
            "calificacionFin": 5,
            "pinfcoinsGanados": 20
        }
    };

    await db.collection('historialApuestas').doc('HGFOTOEW').set(data);

    // crear foro

    data = {
        "titulo": "Por que no funciona esto"
    };

    await db.collection('foro').doc('0').set(data);

    // crear foro mensajes

    data = {
        "m1": {
            "author": "z8JUgK1gH6fH4AXOH1hpuXNLDJx1",
            "texto": "Pues eso, que esto no funciona, alguien me explica"
        },
        "m2": {
            "author": "HGFOTOEW",
            "texto": "Que ere tonto y no sabe quillo"
        }
    };

    await db.collection('foroMensajes').doc('0').set(data);

}


crearDatosDePrueba();
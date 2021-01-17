'use strict'

require('dotenv').config();

const functions = require('firebase-functions');
const app = require('./routes/routes');
const admin = require("./firebase/firebaseAdmin");

let database = admin.dataBase;

exports.api = functions.https.onRequest(app);

exports.userCreated = functions.auth.user().onCreate( async (user) => {
    let userData = {
        nick: "@" + user.uid,
        estado: "Apostando a tope",
        pinfcoins: 0,
        idioma: "es",
        pinfcoinsGanados: 0
    };

    await database.collection('usuarios').doc(user.uid).set(userData);

});

// BORRAR

let db = admin.dataBase;

async function crearDatosDePrueba() {

    // Crear usuario
    let data = {
        "nick": "@drull90",
        "estado": "Apostando a tope",
        "fotoUrl": "z8JUgK1gH6fH4AXOH1hpuXNLDJx1-FOTO",
        "pinfcoins": 200,
        "verificado": true,
        "idioma": "es",
        "apuestasActivas": {
            "BBB": true,
        }
    };

    await db.collection('usuarios').doc('z8JUgK1gH6fH4AXOH1hpuXNLDJx1').set(data);

    data = {
        "nick": "@rgued98",
        "estado": "Apostando a tope",
        "fotoUrl": "HGFOTOEW-FOTO",
        "pinfcoins": 3,
        "verificado": false,
        "idioma": "en",
        "apuestasActivas": {
            "AAAAA": true,
        }
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
        "21714001": {
            "HGFOTOEW": "AAAAA",
            "z8JUgK1gH6fH4AXOH1hpuXNLDJx1": "BBB"
        },
        "21714002": {

        },
        "21714003": {},
        "21714004": {},
        "21714005": {}
    };

    await db.collection('matricula').doc('z8JUgK1gH6fH4AXOH1hpuXNLDJx1').set(data, {merge: true});

    data = {
        "2007003": {
            "HGFOTOEW": "z8JUgK1gH6fH4AXOH1hpuXNLDJx1-HGFOTOEW-2007003",
            "z8JUgK1gH6fH4AXOH1hpuXNLDJx1": "z8JUgK1gH6fH4AXOH1hpuXNLDJx1-HGFOTOEW-2007003"
        }
    };

    await db.collection('matricula').doc('HGFOTOEW').set(data, {merge: true});

    data = {
        "2007001": {
            "HGFOTOEW": "z8JUgK1gH6fH4AXOH1hpuXNLDJx1-HGFOTOEW-2007003",
            "z8JUgK1gH6fH4AXOH1hpuXNLDJx1": "z8JUgK1gH6fH4AXOH1hpuXNLDJx1-HGFOTOEW-2007003"
        }
    };

    await db.collection('matricula').doc('HGFOTOEW').set(data, {merge: true});

    data = {
        "2007002": {}
    };

    await db.collection('matricula').doc('HGFOTOEW').set(data, {merge: true});

    // crear amistades

    data = {
        "HGFOTOEW": true
    };

    await db.collection('amistades').doc('z8JUgK1gH6fH4AXOH1hpuXNLDJx1').set(data);

    data = {
        "z8JUgK1gH6fH4AXOH1hpuXNLDJx1": true
    };

    await db.collection('amistades').doc('HGFOTOEW').set(data);

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
        "usuario": "HGFOTOEW",
        "destinatario": "z8JUgK1gH6fH4AXOH1hpuXNLDJx1",
        "estado": "Suspende",
        "calificacion": 3,
        "pinfCoins": 10
    };

    await db.collection('apuestas').doc('BBB').set(data);

    data = {
        "usuario": "HGFOTOEW",
        "destinatario": "z8JUgK1gH6fH4AXOH1hpuXNLDJx1",
        "estado": "Suspende",
        "calificacion": 3,
        "pinfCoins": 10
    };

    await db.collection('apuestas').doc('AAAAA').set(data);

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

    // data = {
    //     "z8JUgK1gH6fH4AXOH1hpuXNLDJx1-HGFOTOEW-2007005": {
    //         "destinatario": "HQWSSAZC",
    //         "estado": "aprueba",
    //         "calificacion": 8,
    //         "estadoFin": "aprobado",
    //         "calificacionFin": 5,
    //         "pinfcoinsGanados": 20
    //     },
    //     "z8JUgK1gH6fH4AXOH1hpuXNLDJx1-HGFOTOEW-2007006": {
    //         "destinatario": "HQWSSAZC",
    //         "estado": "aprueba",
    //         "calificacion": 8,
    //         "estadoFin": "aprobado",
    //         "calificacionFin": 5,
    //         "pinfcoinsGanados": 20
    //     }
    // };

    // await db.collection('historialApuestas').doc('z8JUgK1gH6fH4AXOH1hpuXNLDJx1').set(data);

    // data = {
    //     "z8JUgK1gH6fH4AXOH1hpuXNLDJx1-HGFOTOEW-2007005": {
    //         "destinatario": "HQWSSAZC",
    //         "estado": "aprueba",
    //         "calificacion": 8,
    //         "estadoFin": "aprobado",
    //         "calificacionFin": 5,
    //         "pinfcoinsGanados": 20
    //     },
    //     "z8JUgK1gH6fH4AXOH1hpuXNLDJx1-HGFOTOEW-2007006": {
    //         "destinatario": "HQWSSAZC",
    //         "estado": "aprueba",
    //         "calificacion": 8,
    //         "estadoFin": "aprobado",
    //         "calificacionFin": 5,
    //         "pinfcoinsGanados": 20
    //     }
    // };

    // await db.collection('historialApuestas').doc('HGFOTOEW').set(data);

    // crear foro

    data = {
        "titulo": "Por que no funciona esto",
        author: "pepe",
        authorID: "z8JUgK1gH6fH4AXOH1hpuXNLDJx1"
    };

    await db.collection('foro').doc('0').set(data);

    data = {
        "titulo": "Como se hacen las apuestas",
        author: "Andrea",
        authorID: "HGFOTOEW"
    };

    await db.collection('foro').doc('1').set(data);

    // crear foro mensajes

    data = {
        "m1": {
            "authorID": "z8JUgK1gH6fH4AXOH1hpuXNLDJx1",
            "texto": "Pues eso, que esto no funciona, alguien me explica",
            author: "Andres"
        },
        "m2": {
            "authorID": "HGFOTOEW",
            "texto": "Que ere tonto y no sabe quillo",
            "author": "pepe"
        }
    };

    await db.collection('foroMensajes').doc('0').set(data);

}


//crearDatosDePrueba();
'use strict'

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
    await database.collection('uuids').doc(userData.nick).set(user.id);
});

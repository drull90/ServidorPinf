'use strict'

let admin = require("../../firebase/firebaseAdmin");

let database = admin.dataBase;
let firebase = admin.firebaseAdmin.firestore;

async function aceptarPeticion(req, res) {
    try {
        let uid = req.user.uid;

        let uidPeticion = req.body.uidPeticion;

        // Eliminar peticion enviada, peticion  recibida si existen

        await database.collection('peticionesRecibidas').doc(uid).update({[uidPeticion]: firebase.FieldValue.delete()});

        await database.collection('peticionesRecibidas').doc(uidPeticion).update({ [uid]: firebase.FieldValue.delete()});

        let data = {[uidPeticion]: true}

        await database.collection('amistades').doc(uid).set(data, { merge: true });

        data = {[uid]: true}

        await database.collection('amistades').doc(uidPeticion).set(data, { merge: true });

        res.status(200).send('{ "message": "Peticion aceptada" }');
    }
    catch(error) {
        console.log(error);
        res.status(500).send('{ "message": "' + error + '" }');
    }
    
}

async function rechazarPeticion(req, res) {
    try {
        let uid = req.user.uid;

        let uidPeticion = req.body.uidPeticion;

        // Eliminar peticion enviadam peticion recibida si existen
        await database.collection('peticionesRecibidas').doc(uid).update({[uidPeticion]: firebase.FieldValue.delete()});

        await database.collection('peticionesEnviadas').doc(uidPeticion).update({[uid]: firebase.FieldValue.delete()});

        res.status(200).send('{ "message": "Peticion rechazada" }');
    }
    catch(error) {
        console.log(error);
        res.status(500).send('{ "message": "' + error + '" }');
    }
}

module.exports = {
    aceptarPeticion,
    rechazarPeticion
};
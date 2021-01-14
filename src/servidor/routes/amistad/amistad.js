'use strict'

let admin = require("../../firebase/firebaseAdmin");

let database = admin.dataBase;
let firebase = admin.firebaseAdmin.firestore;

async function aceptarPeticion(req, res) {
    try {
        let uid = req.user.uid;

        let uidPeticion = req.body;

        // Eliminar peticion enviada
        await database.collection('peticionesRecibidas').doc(uid).update({[uidPeticion]: firebase.FieldValue.delete()});

        // Eliminar peticion recibida
        await database.collection('peticionesRecibidas').doc(uidPeticion).update({ [uid]: firebase.FieldValue.delete()});

        let data = {[uidPeticion]: true}

        // Guardar en amigos ambos usuarios
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

        let uidPeticion = req.body;

        // Eliminar peticion enviada
        await database.collection('peticionesRecibidas').doc(uid).update({[uidPeticion]: firebase.FieldValue.delete()});
        // Eliminar peticion recibida
        await database.collection('peticionesEnviadas').doc(uidPeticion).update({[uid]: firebase.FieldValue.delete()});

        res.status(200).send('{ "message": "Peticion rechazada" }');
    }
    catch(error) {
        console.log(error);
        res.status(500).send('{ "message": "' + error + '" }');
    }
}

async function getAmistades(req, res) {
    try {
        let uid = req.user.uid;

        let data = {
            data: []
        };

        let peticiones = await database.collection('peticionesRecibidas').doc(uid).get();
        peticiones = peticiones.data();

        if(peticiones) {
            let arr = Object.keys(peticiones);
            for(let i = 0; i < arr.length; ++i) {
                let user = await getDatosPerfil(arr[i]);
                user.tipo = "peticion";
                data.data.push(user);
            }
        }

        let amigos = await database.collection('amistades').doc(uid).get();
        amigos = amigos.data();

        if(amigos) {
            let arr = Object.keys(amigos);
            for(let i = 0; i < arr.length; ++i) {
                let user = await getDatosPerfil(arr[i]);
                user.tipo = "amistad";
                data.data.push(user);
            }
        }

        res.status(200).send(data);
    }
    catch(error) {
        console.log(error);
        res.status(500).send('{ "message": "' + error + '" }');
    }
}

async function getDatosPerfil(uid) {

    let usuario = await database.collection('usuarios').doc(uid).get();
    usuario = usuario.data();

    let data = {
        nick: usuario.nick,
        estado: usuario.estado,
        uid: uid
    }

    return data;
}

module.exports = {
    aceptarPeticion,
    rechazarPeticion,
    getAmistades
};
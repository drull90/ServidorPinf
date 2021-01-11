'use strict'

let admin = require("../../firebase/firebaseAdmin");

let database = admin.dataBase;
let firebase = admin.firebaseAdmin.firestore;

async function getForos(req, res) {

    try {
        let forosDisponibles = {};

        const foros = await database.collection('foro').get();

        foros.forEach((doc) => {
            forosDisponibles[doc.id] = doc.data();
        });

        console.log(forosDisponibles);

        res.status(200).send(forosDisponibles);
    }
    catch(error) {
        console.log(error);
        res.status(500).send('{ "message": "' + error + '" }');
    }

}

async function crearForo(req, res) {
    try {
        let uid = req.user.uid;

        let title = req.body.title;
        let msg = req.body.msg;

        let nick = await database.collection('usuarios').doc(uid).get();

        nick = nick.data().nick;

        let data = {
            titulo: title,
            author: nick
        }

        const foro = database.collection('foro').doc();

        await foro.set(data);

        data = {};
        data["m1"] = {
            author: nick,
            texto: msg
        };

        await database.collection('foroMensajes').doc(foro.id).set(data);

        res.status(200).send('{ "message": "Foro creado" }');
    }
    catch(error) {
        console.log(error);
        res.status(500).send('{ "message": "' + error + '" }');
    }
    
}

async function addMessageForo(req, res) {

    try {
        let uid = req.user.uid;
        let msg = req.body.msg;
        let foro = req.body.id;

        let nick = await database.collection('usuarios').doc(uid).get();

        nick = nick.data().nick;

        let data = {
            author: nick,
            texto: msg
        }

        let foroMsg = await database.collection('foroMensajes').doc(foro).get();

        if(foroMsg !== undefined) {

            let arr = Object.keys(foroMsg.data());

            let key = "m" + (arr.length + 1);

            let data = {};

            data[key] = {
                author: nick,
                texto: msg
            }

            await database.collection('foroMensajes').doc(foro).set(data, { merge: true });

            res.status(200).send('{ "message": "Mensaje agregado" }');
        }
        else {
            res.status(500).send('{ "message": "Error al agregar mensaje" }');
        }
        
    }
    catch(error) {
        console.log(error);
        res.status(500).send('{ "message": "' + error + '" }');
    }

}

module.exports = {
    getForos,
    crearForo,
    addMessageForo
}
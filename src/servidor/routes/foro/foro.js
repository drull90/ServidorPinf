'use strict'

let admin = require("../../firebase/firebaseAdmin");
let database = admin.dataBase;

async function getForos(req, res) {

    try {
        let data = {
            result: []
        };

        const foros = await database.collection('foro').get();

        foros.forEach((doc) => {
            let foro = doc.data();
            foro.id = doc.id;
            data.result.push(foro);
        });

        data.result.reverse();

        res.status(200).send(data);
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

        if(title === "" || title === undefined || msg === "" || msg === undefined) {
            res.status(400).send('{ "message": "Titulo y mensaje no pueden ir vacios" }');
        }
        else {
            let nick = await database.collection('usuarios').doc(uid).get();
            nick = nick.data().nick;

            let data = {
                titulo: title,
                author: nick,
                authorID: uid
            }

            const foros = await database.collection('foro').get();
            let i = 0;
            foros.forEach((doc) => {
                ++i;
            });

            let key = i.toString();

            const foro = await database.collection('foro').doc(key).set(data);

            data = {};
            data["m1"] = {
                author: nick,
                texto: msg,
                authorID: uid
            };

            await database.collection('foroMensajes').doc(foro.id).set(data);

            res.status(200).send('{ "message": "Foro creado" }');
        }
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

        if(msg === "" || msg === undefined || foro === "" || foro === undefined) {
            res.status(400).send('{ "message": "Id foro y mensaje no pueden ir vacios" }');
        }
        else {
            let nick = await database.collection('usuarios').doc(uid).get();
            nick = nick.data().nick;

            let foroMsg = await database.collection('foroMensajes').doc(foro).get();

            if(foroMsg !== undefined) {

                let arr = Object.keys(foroMsg.data());

                let key = "m" + (arr.length + 1);

                let data = {};
                data[key] = {
                    author: nick,
                    texto: msg,
                    authorID: uid
                }

                await database.collection('foroMensajes').doc(foro).set(data, { merge: true });

                res.status(200).send('{ "message": "Mensaje agregado" }');
            }
            else {
                res.status(500).send('{ "message": "Error al agregar mensaje" }');
            }
        }
        
    }
    catch(error) {
        console.log(error);
        res.status(500).send('{ "message": "' + error + '" }');
    }

}

async function getMensajesForo(req, res) {
    try {
        let idForo = req.params.foroid;

        let mensajes = {
            result: []
        };

        // Obtener los mensajes de x foro
        let msgForo = await database.collection('foroMensajes').doc(idForo).get();
        msgForo = msgForo.data();

        if(msgForo !== undefined) {
            let keys = Object.keys(msgForo);
            for(let i = 0; i < keys.length; ++i) {
                let data = {
                    author: msgForo[keys[i]].author,
                    authorID: msgForo[keys[i]].authorID,
                    texto: msgForo[keys[i]].texto
                }
                mensajes.result.push(data);
            }
        }

        res.status(200).send(mensajes);
    }
    catch(error) {
        console.log(error);
        res.status(500).send('{ "message": "' + error + '" }');
    }
}

module.exports = {
    getForos,
    crearForo,
    addMessageForo,
    getMensajesForo
}
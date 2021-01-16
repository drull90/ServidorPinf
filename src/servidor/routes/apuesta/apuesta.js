'use strict'

let admin = require("../../firebase/firebaseAdmin");
let database = admin.dataBase;

async function apuesta(req, res) {

    try {
        let usuarioID = req.user.uid;
        let destinatarioID = req.body.destinatario;
        let estado = req.body.estado;
        let calificacion = req.body.calificacion;
        let codAsignatura = req.body.codAsignatura;

        if(destinatarioID.startsWith('@')) { // Es un nick, lo cambiamos a uid
            let uidReceptor = await database.collection('uuids').doc(destinatarioID).get();
            uidReceptor = uidReceptor.data();
            if(uidReceptor !== undefined) {
                destinatarioID = uidReceptor.uuid;
            }
            else {
                destinatarioID = undefined;
            }
        }
        
        if(destinatarioID !== undefined) {
            let existe = await database.collection('usuarios').doc(destinatarioID).get();
            existe = existe.data();

            if(existe === undefined) {
                res.status(400).send('{ "message": "Destinatario no existe" }');
            }
            else {
                await apostar(usuarioID, destinatarioID, estado, calificacion);
                res.status(200).send('{ "message": apuesta realizada correctamente" }');
            }
        }
        else {
            res.status(400).send('{ "message": "Destinatario no existe" }');
        }

    }
    catch(error) {
        console.log(error);
        res.status(500).send('{ "message": "' + error + '" }');
    }

}

async function apostar(usuario, destinatario, estado, calificacion) {

    if(estado === "Aprueba" || estado === "Suspende") {

    }
    else {
        throw "Estado no es valido";
    }

}

module.exports = {
    apuesta
}
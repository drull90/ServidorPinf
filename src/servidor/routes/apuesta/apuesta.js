'use strict'

let admin = require("../../firebase/firebaseAdmin");
let database = admin.dataBase;

async function apuesta(req, res) {

    try {
        let usuarioID = req.user.uid;
        let destinatarioID = req.body.destinatario;
        let estado = req.body.estado;
        let calificacion = req.body.calificacion;
        let codAsignatura = req.body.codigoAsig;

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
                //Hacemos la apuesta
                await apostar(usuarioID, destinatarioID, estado, calificacion, codAsignatura);
                res.status(200).send('{ "message": "apuesta realizada correctamente" }');
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

async function apostar(usuario, destinatario, estado, calificacion, codAsignatura) {

    if(estado === "Aprueba" || estado === "Suspende" && (calificacion >= 0 && calificacion <= 10) && codAsignatura !== undefined) {

        // Verificamos que existe la asignatura
        let existe = existeAsignatura(codAsignatura);

        if(existe) {
            let data = {
                usuario: usuario,
                destinatario: destinatario,
                estado: estado,
                calificacion: calificacion
            }
    
            //Creamos nuevo documento en apuestas
            let apuesta = database.collection('apuestas').doc();
            let apuestaID = apuesta.id;

            //Guardamos la apuesta
            await apuesta.set(data);

            // Guardamos la apuesta en el perfil del usuario
            await database.collection('usuarios').doc(usuario).set({
                "apuestasActivas": { [apuestaID]: true }
            }, {merge: true});

            // En matricula, guardamos el usuario que ha apostado, con el id de apuesta
            let str = codAsignatura + "." + usuario;
            await database.collection('matricula').doc(destinatario).update({
                [str]: apuestaID
            }, {merge: true});

        }
        else {
            throw "Asignatura no existe";
        }
    }
    else {
        throw "Error en datos de la apuesta";
    }

}

async function existeAsignatura(codigo) {
    let existe = 0;

    let asignatura = await database.collection('asignaturas').doc(codigo).get();
    asignatura = asignatura.data();

    if(asignatura == undefined) {
        existe = 1;
    }
    return existe;
}

module.exports = {
    apuesta
}
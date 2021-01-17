'use stric'

let admin = require("../../firebase/firebaseAdmin");

let database = admin.dataBase;
let fbauth = admin.firebaseAdminAuth;

async function changeUserStatus(req, res) {
    try {
        let uid = req.user.uid;

        await database.collection('usuarios').doc(uid).update({
            "estado": req.body.estado
        })

        res.status(200).send('{ "message": "User status changed" }');
    }
    catch(error) {
        console.log(error);
        res.status(500).send('{ "message": "' + error + '" }');
    }
}

async function getUserProfile(req, res) {
    try {
        let uid = req.user.uid;

        let data = {
            nick: null,
            pinfcoins: null,
            estado: null,
            email: null
        }

        let userData = await database.collection('usuarios').doc(uid).get();
        userData = userData.data();

        let user = await fbauth.getUser(uid);

        data.nick = userData.nick;
        data.pinfcoins = userData.pinfcoins;
        data.estado = userData.estado;
        data.email = user.email;

        res.status(200).send(data);
    }
    catch(error) {
        console.log(error);
        res.status(500).send('{ "message": "' + error + '" }');
    }
}

async function cambiarNick(req, res){
    
    try {
        let usuario = req.user.uid; 
        let newnombre = req.body.nick;
        let arroba ="@";

        if(!newnombre.startsWith("@")){
            newnombre = arroba.concat(newnombre);
        }

        let nombreantiguo = await database.collection('usuarios').doc(usuario).get();
        nombreantiguo = nombreantiguo.data().nick;
        
        let nuevonombre = await database.collection('uuids').doc(newnombre).get();
        nuevonombre = nuevonombre.data();

        if(nuevonombre === undefined) {
            await database.collection('usuarios').doc(usuario).update({
                "nick": newnombre
            })

            await database.collection('uuids').doc(nombreantiguo).delete();

            let data = {};
            data[newnombre] = {
                "uuid":usuario
            } 
        
            await database.collection('uuids').doc(newnombre).set(data);

            res.status(200).send('{ "message": "Nick cambiado" }');
        }
        else{
            res.status(400).send('{ "message": "Nombre de usuario ya existe" }');
        }
     
    }
    catch(error) {
        console.log(error);
        res.status(500).send('{ "message": "' + error + '" }');
    }
}

async function getNick(req, res) {
    try {
        let uidDestino = req.params.id;

        let data = {
            nick: null
        }

        let usuario = await database.collection('usuarios').doc(uidDestino).get();
        usuario = usuario.data();

        if(usuario !== undefined)
        {
            data.nick = usuario.nick;
            res.status(200).send(data);
        }
        else{
            res.status(400).send('{ "message": "El usuario no existe" }');
        }
    }
    catch(error){
        console.log(error);
        res.status(500).send('{ "message": "' + error + '" }');
    }
}

async function getExternalProfile(req, res) {
    try {
        let uid = req.user.uid;
        let uidDestino = req.params.id;

        let data = {
            nick: null,
            uid: uidDestino,
            amistad: null,
            asignaturas: [],
            apuestas: []
        }

        let usuario = await database.collection('usuarios').doc(uidDestino).get();
        usuario = usuario.data();

        if(usuario !== undefined) {

            data.nick = usuario.nick;

            // Obtenemos el estado de la amistad (amigos, enviada, nada)
            let amigos = await obtenerEstadoAmistad(uid, uidDestino);
            
            data.amistad = amigos;

            // Si son amigos: Obtenemos las apuestas que ha hecho el usuario al usuario que estamos viendo
            // Obtenemos las asignaturas del usuario
            if(amigos === "amigos") {

                // Obtenemos los nombres de las asignaturas matriculadas
                const datosMatricula = await database.collection('matricula').doc(uidDestino).get();
                if(datosMatricula.data() !== undefined) {
                    let arr = Object.keys(datosMatricula.data());
                    for(let i = 0; i < arr.length; ++i) {
                        let d = {
                            codigo: arr[i],
                            nombre: await getAsignatura(arr[i])
                        };
                        data.asignaturas.push(d)
                    }
                }

                // Obtenemos las apuestas que ha realizado al usuario
                let matricula = datosMatricula.data();
                let keys = Object.keys(matricula);

                for(let i = 0; i < keys.length; ++i) { // Por cada asignatura del usuario destinarario, miramos si aparece el uid del usuario
                    let apuestas = matricula[keys[i]]
                    
                    if(apuestas[uid] !== undefined) { // El usuario tiene una apuesta hecha

                        // Obtenemos la apuesta
                        let apuestaId = apuestas[uid];

                        let apuesta = {};

                        let datosApuesta = await database.collection('apuestas').doc(apuestaId).get();
                        datosApuesta = datosApuesta.data();

                        if(datosApuesta !== undefined) {

                            apuesta = {
                                nota: datosApuesta.calificacion,
                                aprueba: datosApuesta.estado,
                                codigo: keys[i]
                            }

                            data.apuestas.push(apuesta);
                        }
                    }
                }

                let table = {
                    nick: data.nick,
                    uid: data.uid,
                    amistad: data.amistad,
                    tabla: []
                };

                // Ponemos en tabla las asignaturas con el patron
                let asignaturaTabla = {
                    codigo: null,
                    nombre: null,
                    apostado: false
                };

                for(let i = 0; i < data.asignaturas.length; ++i) { // Por cada asignatura miramos si tiene una apuesta hecha
                    
                    let asignatura = data.asignaturas[i];
                    let codigo  = asignatura.codigo;
                    let existe = 0;
                    //Por cada apuesta, miramos si coincide el codigo, si coincide, es una asignatura apostada, si ninguno lo hace, no se ha apostado
                    for(let j = 0; j < data.apuestas.length; ++j) {
                        let apuesta = data.apuestas[j];
                        if(apuesta.codigo === codigo) {
                            existe = 1;
                        }
                    }

                    asignaturaTabla = {
                        codigo: codigo,
                        nombre: asignatura.nombre
                    }

                    if(existe) {
                        asignaturaTabla.apostado = true;
                    }
                    else {
                        asignaturaTabla.apostado = false;
                    }

                    table.tabla.push(asignaturaTabla);

                }

                data = table;

            }
           
            res.status(200).send(data);
        }
        else {
            res.status(400).send('{ "message": "El usuario no existe" }');
        }
 
    }
    catch(error) {
        console.log(error);
        res.status(500).send('{ "message": "' + error + '" }');
    }

}

async function getAsignatura(asignatura) {
    let nombre = await database.collection('asignaturas').doc(asignatura).get();
    nombre = nombre.data();

    return nombre.nombre;
}

async function obtenerEstadoAmistad(uid, uidDestino) {
    let amigos = null;
    try {
        amigos = await database.collection('amistades').doc(uid).get();
        amigos = amigos.data();

        if(amigos !== undefined) {
            
            let existe = amigos[uidDestino];
            if(existe !== undefined) {
                amigos = "amigos"
            }
            else {
                amigos = undefined;
            }

        }
        
        // No son amigos
        if(amigos === undefined) {
            // Buscamos si ha enviado una peticion al usuario
            let peticion = await database.collection('peticionesEnviadas').doc(uid).get();
            peticion = peticion.data();

            if(peticion !== undefined) {

                let existe = peticion[uidDestino];
                if(existe !== undefined) {
                    amigos = "enviada"
                }
                else {
                    amigos = "";
                }
            }
            else {
                // No ha enviado ninguna peticion
                amigos = "";
            }
        }
    }
    catch(error) {
        console.log(error);
    }

    return amigos;
}

module.exports = {
    changeUserStatus,
    getUserProfile,
    cambiarNick,
    getExternalProfile,
    getNick
}
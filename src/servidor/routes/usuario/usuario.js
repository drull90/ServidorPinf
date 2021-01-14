'use stric'

let admin = require("../../firebase/firebaseAdmin");

let database = admin.dataBase;
let fbauth = admin.firebaseAdminAuth;

async function listarAsignaturas(req, res) {
    try {
        let uid = req.body;

        const datosMatricula = await database.collection('matricula').doc(uid).get();

        // Enviar codigo y nombre
        let asignaturas = {};

        if(datosMatricula.data() !== undefined) {
            let arr = Object.keys(datosMatricula.data());
            await Promise.all(arr.map(async (asignatura) => {
                let nombre = await database.collection('asignaturas').doc(asignatura).get();
                asignaturas[asignatura] = nombre.data().nombre;
            }));
        }

        res.send(asignaturas);
    }
    catch(error) {
        console.log(error);
        res.send('{ "message": "' + error + '" }');
    }
}

async function changeUserStatus(req, res) {
    try {
        let uid = req.user.uid;

        const status = await database.collection('usuarios').doc(uid).update({
            "estado": req.body
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
    
    try{
    let usuario = req.user.uid; 
    let newnombre = req.body.nuevonick;
    let arroba ="@";
    if(!newnombre.startsWith("@")){
      newnombre = arroba.concat(newnombre);
    }
    let nombreantiguo = await database.collection('usuarios').doc(usuario).get();
    nombreantiguo = nombreantiguo.data().nick;
    

    let nuevonombre = await database.collection('uuids').doc(newnombre).get();
    nuevonombre = nuevonombre.data();

    if(nuevonombre==undefined){
        const status = await database.collection('usuarios').doc(usuario).update({
            "nick": newnombre
        })

        await database.collection('uuids').doc(nombreantiguo).delete();

        let data = {};

        data[newnombre] = {
            "uuid":usuario
        } 
    
        await database.collection('uuids').doc(newnombre).set(data);

        res.status(200).send('{ "message": "Nick cambiado" }');
    }else{
        res.status(400).send('{ "message": "Nombre de usuario ya existe" }');
    }
     
    }
    catch(error) {
        console.log(error);
        res.status(500).send('{ "message": "' + error + '" }');
    }
}



module.exports = {
    listarAsignaturas,
    changeUserStatus,
    getUserProfile,
    cambiarNick
}
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
        //await database.collection('peticionesRecibidas').doc(uidPeticion).update({[uid]: firebase.FieldValue.delete()});

        // Eliminar peticion recibida
        await database.collection('peticionesEnviadas').doc(uidPeticion).update({ [uid]: firebase.FieldValue.delete()});
        //await database.collection('peticionesEnviadas').doc(uid).update({ [uidPeticion]: firebase.FieldValue.delete()});

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

async function eliminarPeticion(req, res) {
  try {
    let uid = req.user.uid;

    let uidDestino = req.params.uid;

    if(uidDestino.startsWith("@")) {
      uidDestino = await database.collection('uuids').doc(uidDestino).get();
      uidDestino = uidDestino.data();
      uidDestino = uidDestino.uuid;
    }

    if(uidDestino) {
      // Eliminar peticion enviada
      await database.collection('peticionesEnviadas').doc(uid).update({[uidDestino]: firebase.FieldValue.delete()});
      // Eliminar peticion recibida
      await database.collection('peticionesRecibidas').doc(uidDestino).update({[uid]: firebase.FieldValue.delete()});

      res.status(200).send('{ "message": "Peticion eliminada" }');
    }
    else {
      res.status(400).send('{ "message": "No existe la peticion" }');
    }
    
  }
  catch(error) {
      console.log(error);
      res.status(500).send('{ "message": "' + error + '" }');
  }
}

async function eliminarAmigo(req, res) {
  try {
    let uid = req.user.uid;

    let uidDestino = req.params.uid;

    if(uidDestino.startsWith("@")) {
      uidDestino = await database.collection('uuids').doc(uidDestino).get();
      uidDestino = uidDestino.data();
      uidDestino = uidDestino.uuid;
    }

    if(uidDestino) {

      // Eliminar de amistades a ambos
      await database.collection('amistades').doc(uid).update({[uidDestino]: firebase.FieldValue.delete()});

      await database.collection('amistades').doc(uidDestino).update({[uid]: firebase.FieldValue.delete()});

      res.status(200).send('{ "message": "Amigo eliminado correctamente" }');
    }
    else {
      res.status(400).send('{ "message": "No existe el amigo" }');
    }

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

async function enviarSolicitudAmistad(req,res){
  try {
    let emisor = req.user.uid;
    let receptor = req.body.receptor;

    if(receptor.startsWith('@')) { // Es un nick, buscamos su uid
      let uidReceptor = await database.collection('uuids').doc(receptor).get();
      uidReceptor = uidReceptor.data();
      if(uidReceptor !== undefined) {
        receptor = uidReceptor.uuid;
      }
      else {
        receptor = undefined;
      }
    }
    else {
      let uidReceptor = await database.collection('usuarios').doc(receptor).get();
      uidReceptor = uidReceptor.data();
      if(uidReceptor === undefined) {
        receptor = undefined;
      }
    }

    if(receptor !== undefined) {

      if(receptor !== emisor) {
        // Comprobamos que no sean amigos ya
        let sonAmmigos = await database.collection('amistades').doc(emisor).get();
        sonAmmigos = sonAmmigos.data();

        if(sonAmmigos !== undefined) {
          sonAmmigos = sonAmmigos[receptor];
        }

        if(!sonAmmigos) {

          let data = {
            [receptor]: true
          };

          // Metemos en peticiones enviadas del emisor
          await database.collection('peticionesEnviadas').doc(emisor).set(data, { merge: true });

          data = {
            [emisor]: true
          }

          // Metemos en petciones recibidas del receptor
          await database.collection('peticionesRecibidas').doc(receptor).set(data, { merge: true });

          res.status(200).send('{ "message": "Peticion realizada con exito" }');
        }
        else {
          res.status(400).send('{ "message": "Ya sois amigos" }');
        }
      }
      else {
        res.status(400).send('{ "message": "No puedes autoenviarte una solicitud" }');
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
    getAmistades,
    enviarSolicitudAmistad,
    eliminarPeticion,
    eliminarAmigo
};
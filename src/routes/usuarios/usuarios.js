'use strict'

const fbAdmin = require('../../firebase/firebaseAdmin');
const fbApp   = require('../../firebase/firebaseApp');

const dataBase = fbAdmin.dataBase;

async function crearUsuarioConEmail(req, res) {
    let nick = req.body.nick;
    let email = req.body.email;
    let pass = req.body.password;
    try { 
        let response = await fbAdmin.firebaseAdminAuth.createUser({
            uid: nick,
            email: email,
            password: pass
        });
        dataBase.collection("usuarios").doc(nick).set({
            uid: nick,
            email: email,
            estado: "Apostando a tope",
            emailVerified: false,
        });
        res.status(200).send(response);
    }
    catch(error) {
        console.log("Error al crear usuario");
        res.status(409).send(error.message);
    }
}

// async function logout(req, res) {
//     try {
//         await fbApp.firebaseAppAuth.signOut();
//         res.status(200).send();
//     }
//     catch(error) {
//         console.log(error)
//         res.status(500).send();
//     }
// }

async function entrarConEmail(req, res) {
    try {
        let email = req.body.email;
        let pass = req.body.password;
        let response = await fbApp.firebaseAppAuth.signInWithEmailAndPassword(email, pass);
        res.status(200).send(response);
    }
    catch(error) {
        res.status(403).send(error.message);
    }
}

module.exports = {
    crearUsuarioConEmail,
    entrarConEmail,
    logout,
    entrarConGoogle
};
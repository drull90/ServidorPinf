'use strict'

const firebaseAppAuth = require('../../firebase/firebaseApp').firebaseAppAuth;

async function crearUsuarioConEmail(req, res) {
    try {
        let email = req.body.email;
        let pass = req.body.password;
        let response = await firebaseAppAuth.createUserWithEmailAndPassword(email, pass);
        res.status(201).send(response);
    }
    catch(error) {
        res.status(409).send(error.message);
    }
}

async function entrarConEmail(req, res) {
    try {
        let email = req.body.email;
        let pass = req.body.password;
        let response = await firebaseAppAuth.signInWithEmailAndPassword(email, pass);
        res.status(200).send(response);
    }
    catch(error) {
        res.status(403).send(error.message);
    }
}

module.exports = {
    crearUsuarioConEmail,
    entrarConEmail
};
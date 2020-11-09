'use strict'

const firebaseAdmin = require('firebase-admin');

firebaseAdmin.initializeApp();
const firebaseAdminAuth = firebaseAdmin.auth();

async function isAuth(req, res, next) {
    if(!req.headers.authorization) {
        return res.status(401).send();
    }    
    try {
        let token = req.headers.authorization.split(" ")[1];
        let response = await firebaseAdminAuth.verifyIdToken(token);
    }
    catch(error) {
        return res.status(401).send(error);
    }

    next();    
}

module.exports = {
    isAuth,
    firebaseAdmin
}
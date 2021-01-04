'use strict'

const firebaseAdmin = require('firebase-admin');

firebaseAdmin.initializeApp();
const firebaseAdminAuth = firebaseAdmin.auth();

const dataBase = firebaseAdmin.firestore();

async function isAuth(req, res, next) {
    if(!req.headers.authorization) {
        return res.status(401).send();
    }    
    try {
        let user = await firebaseAdminAuth.verifyIdToken(getUserToken(req));
        req.user = user;
    }
    catch(error) {
        return res.status(401).send('{ "message": "User not logged" }');
    }

    next();    
}

function getUserToken(req) {
    return req.headers.authorization.split(" ")[1];
}

module.exports = {
    isAuth,
    firebaseAdmin,
    firebaseAdminAuth,
    dataBase,
    getUserToken
}
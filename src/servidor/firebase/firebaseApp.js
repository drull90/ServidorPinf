'use strict'

const firebaseApp = require('firebase/app');
const firebaseConfig = require('./firebaseConfig');

require("firebase/auth");

firebaseApp.initializeApp(firebaseConfig.firebaseConfig);
const firebaseAppAuth = firebaseApp.auth();

module.exports = {
    firebaseApp,
    firebaseAppAuth
}
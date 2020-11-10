'use strict'

require('dotenv').config();

const functions = require('firebase-functions');
//const admin = require('./firebase/firebaseAdmin').firebaseAdmin;

const app = require('./app');

exports.api = functions.https.onRequest(app);
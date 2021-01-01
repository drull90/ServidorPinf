'use strict'

require('dotenv').config();

const functions = require('firebase-functions');

const app = require('./routes/routes');

exports.api = functions.https.onRequest(app);
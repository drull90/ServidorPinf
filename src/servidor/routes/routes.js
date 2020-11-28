'use strict'

const express = require('express');
const app = express();

const firebaseAdmin = require('../firebase/firebaseAdmin');

const datos = require('./datos/datos');

app.get('/datos', firebaseAdmin.isAuth, datos.getDatos);

module.exports = app;
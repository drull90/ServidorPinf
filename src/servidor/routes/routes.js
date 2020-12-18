'use strict'

const express = require('express');
const app = express();

const firebaseAdmin = require('../firebase/firebaseAdmin');

const datos = require('./datos/datos');
const expediente = require("./expediente/subirExpediente");

app.get('/datos', /* firebaseAdmin.isAuth,*/ datos.getDatos);
app.post("/prueba", expediente.prueba);

module.exports = app;
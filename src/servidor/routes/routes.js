'use strict'

const express = require('express');
const app = express();

const firebaseAdmin = require('../firebase/firebaseAdmin');

const datos = require('./datos/datos');
const expediente = require("./expediente/subirExpediente");
const usuario = require("./usuario/usuario");

app.get('/datos', firebaseAdmin.isAuth, datos.getDatos);
app.get('/prueba', usuario.listarAsignaturas);

module.exports = app;
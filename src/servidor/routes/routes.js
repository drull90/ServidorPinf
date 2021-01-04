'use strict'

const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors({ origin: true }));

const firebaseAdmin = require('../firebase/firebaseAdmin');

const datos = require('./datos/datos');
const expediente = require("./expediente/subirExpediente");
const usuario = require("./usuario/usuario");

app.get('/datos', firebaseAdmin.isAuth, datos.getDatos);
app.get('/prueba', firebaseAdmin.isAuth, usuario.listarAsignaturas);
app.post('/userstatus', firebaseAdmin.isAuth, usuario.changeUserStatus);


module.exports = app;
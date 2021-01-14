'use strict'

const cors = require('cors');
const express = require('express');
const app = express();

app.use(cors({ origin: true }));

const firebaseAdmin = require('../firebase/firebaseAdmin');

const expediente = require("./expediente/subirExpediente");
const usuario = require("./usuario/usuario");
const amistad = require("./amistad/amistad");
const foro = require('./foro/foro');

app.get('/asignaturas', firebaseAdmin.isAuth, usuario.listarAsignaturas);
app.post('/userstatus', firebaseAdmin.isAuth, usuario.changeUserStatus);
app.post('/aceptarpeticion', firebaseAdmin.isAuth, amistad.aceptarPeticion);
app.post('/rechazarpeticion', firebaseAdmin.isAuth, amistad.rechazarPeticion);
app.get('/foros', firebaseAdmin.isAuth, foro.getForos);
app.post('/foro', firebaseAdmin.isAuth, foro.crearForo);
app.post('/msgforo', firebaseAdmin.isAuth, foro.addMessageForo);
app.get('/userdata', firebaseAdmin.isAuth, usuario.getUserProfile);
app.get('/amistades', firebaseAdmin.isAuth, amistad.getAmistades);
app.get('/expediente', firebaseAdmin.isAuth, expediente.getExpediente);
app.get('/matricula'), firebaseAdmin.isAuth, matricula.getMatricula);

module.exports = app;
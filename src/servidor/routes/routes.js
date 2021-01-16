'use strict'

const cors = require('cors');
const express = require('express');
const app = express();

const firebaseAdmin = require('../firebase/firebaseAdmin');

const expediente = require("./expediente/expediente");
const usuario = require("./usuario/usuario");
const amistad = require("./amistad/amistad");
const foro = require('./foro/foro');
const matricula = require('./matricula/matricula');

app.use(cors({ origin: true }));

app.post('/userstatus', firebaseAdmin.isAuth, usuario.changeUserStatus);
app.post('/cambiarnick', firebaseAdmin.isAuth, usuario.cambiarNick);
app.post('/aceptarpeticion', firebaseAdmin.isAuth, amistad.aceptarPeticion);
app.post('/rechazarpeticion', firebaseAdmin.isAuth, amistad.rechazarPeticion);
app.post('/enviarsolicitudamistad', firebaseAdmin.isAuth,amistad.enviarSolicitudAmistad);
app.delete('/amistad/:uid', firebaseAdmin.isAuth, amistad.eliminarAmigo);
app.delete('/peticion/:uid', firebaseAdmin.isAuth, amistad.eliminarPeticion);
app.get('/foros', firebaseAdmin.isAuth, foro.getForos);
app.post('/foro', firebaseAdmin.isAuth, foro.crearForo);
app.post('/msgforo', firebaseAdmin.isAuth, foro.addMessageForo);
app.get('/msgforo/:foroid', firebaseAdmin.isAuth, foro.getMensajesForo);
app.get('/userdata', firebaseAdmin.isAuth, usuario.getUserProfile);
app.get('/profile/:id', firebaseAdmin.isAuth, usuario.getExternalProfile);
app.get('/amistades', firebaseAdmin.isAuth, amistad.getAmistades);
app.get('/expediente', firebaseAdmin.isAuth, expediente.getExpediente);
app.post('/expediente', firebaseAdmin.isAuth, expediente.subirExpediente);
app.post('/subirExpedienteManual', firebaseAdmin.isAuth, expediente.subirExpedienteManual);
app.get('/matricula', firebaseAdmin.isAuth, matricula.getMatricula);
app.post('/matricula', firebaseAdmin.isAuth, matricula.subirMatricula);
app.post('/subirMatriculaManual', firebaseAdmin.isAuth, matricula.subirMatriculaManual)


module.exports = app;
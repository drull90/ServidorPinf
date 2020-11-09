'use strict'

const express = require('express');
const app = express();

const firebaseAdmin = require('../firebase/firebaseAdmin');

const usuarios = require('./usuarios/usuarios');
const datos = require('./datos/datos');

app.post('/crearUsuario', usuarios.crearUsuarioConEmail);
app.post('/login', usuarios.entrarConEmail);
app.get('/datos', firebaseAdmin.isAuth, datos.getDatos);

module.exports = app;
'use strict'

const express = require('express');
const app = express();

const firebaseAdmin = require('../firebase/firebaseAdmin');

const usuarios = require('./usuarios/usuarios');
const datos = require('./datos/datos');

app.post('/register/email', usuarios.crearUsuarioConEmail);
//app.post('/register/google', usuarios.entrarConGoogle);
//app.post('/register/facebook', usuarios.crearUsuarioConEmail);
//app.post('/register/twiter', usuarios.crearUsuarioConEmail);
app.post('/login', usuarios.entrarConEmail);
//app.post('/logout', usuarios.logout);
app.get('/datos', firebaseAdmin.isAuth, datos.getDatos);

module.exports = app;
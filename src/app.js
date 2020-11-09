'use strict'

const cors = require('cors');
const app = require('./routes/routes');

app.use(cors({ origin: true }));

module.exports = app;
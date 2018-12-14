const express = require('express');

const app = express();


app.use(require('./login'));
app.use(require('./peticiones'));
app.use(require('./empleado'));
app.use(require('./tareas'));


module.exports = app;
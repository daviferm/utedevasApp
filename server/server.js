require('./config/config');

const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

const colors = require('colors');
const mongoose = require('mongoose');
const hbs = require('hbs');

const app = express();

//Libreria para recibir parámetros de un formulario
const bodyParser = require('body-parser');


app.set('view engine', 'hbs');

//es necesarios para trabajar con socket-io
let server = http.createServer(app);


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// Para manejar el formularios como application/json
app.use(bodyParser.json());

//Nos ayuda a formar una path juntando varios parámetros
const path = require('path');

//path de la carpeta pública
const publicPath = path.resolve(__dirname, '../public');

app.use(express.static(publicPath));

//Configuracion global de todas las rutas
app.use(require('./rutas/index'));

const port = process.env.PORT || 3000;

// IO = esta es la comunicacion del backend
//exportamos socketIO para manejarlo en otro archivo
module.exports.io = socketIO(server);


//volvemos a requerir el archivo que maneja socketIO
require('./sockets/socket');


//Conectar la base de datos
mongoose.connect(process.env.URLDB, { useNewUrlParser: true }, (err, res) => {

    if (err) throw err;

    console.log('Base de datos ONLINE'.green);
});

server.listen(process.env.PORT, (err) => {

    if (err) throw new Error(err);

    console.log(`Servidor corriendo en puerto ${ process.env.PORT }`.yellow);

});
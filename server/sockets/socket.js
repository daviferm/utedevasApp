//Requerimos el objeto que maneja la libreria socket-io
const { io } = require('../server');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Usuarios } = require('../clases/usuarios');

const usuarios = new Usuarios();

const Empleado = require('../modelo/empleado');


io.on('connection', (client) => {
    console.log('Usuario conectado');

    client.on('userConection', (data, callback) => {

        let empleados = usuarios.agregarPersona(client.id, data.nombre);

        client.broadcast.emit('listaEmpleados', usuarios.getPersonas());

        callback(usuarios.getPersonas());

    });

    client.on('nuevaTarea', () => {

        client.broadcast.emit('actualizarTareas');
    })



    client.on('disconnect', () => {

        let userDesconect = usuarios.borrarPersona(client.id);

        client.broadcast.emit('crearMensaje', { usuario: 'Administrador', mensaje: `${userDesconect.nombre} se ha desconectado` });
        client.broadcast.emit('listaEmpleados', usuarios.getPersonas());

    })

});


module.exports = io;
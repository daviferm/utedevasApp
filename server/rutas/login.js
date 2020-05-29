const express = require('express');
const hbs = require('hbs');
const _ = require('underscore');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

app.set('view engine', 'hbs');

const Empleado = require('../modelo/empleado');

const { verificaToken } = require('../middlewares/autenticacion');

app.get('/', (rep, res) => {
    res.render('home');
});

app.get('/mantenimiento', (req, res) => {

    res.render('mantenimiento');

});

app.get('/autentificar', verificaToken, (req, res) => {

    return res.json({
        ok: true,
        usuario: req.usuario
    });
})

app.get('/tareas', (req, res) => {

    res.render('lista-tareas');
});


app.post('/login', (req, res) => {

    let body = req.body;
    // console.log(body);

    //Este método regresa solo un usuario
    //Puedo especificar una codición en el primer parámetro
    Empleado.findOne({ nick: body.nombre }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        //Verificamos si el email de usuario existe
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensage: '(Usuario) o contraseña incorrecto'
                }
            })
        }
        //Verificamos si la contraseña es correcta con una función de la libreria bcrypt
        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensage: 'Usuario o (contraseña) incorrecto'
                }
            })
        }
        //Especificamos los parámetros que queremos enviar al Front-end
        let empleado = _.pick(usuarioDB, ['_id', 'role', 'nombre', 'nick', 'email']);

        // //Generamos un token
        let token = jwt.sign({
            usuario: empleado
        }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

        let usuario = {
            ok: true,
            usuario: empleado,
            token
        };

        return res.json(usuario)

    });
});

app.post('/cambiopassword', verificaToken, (req, res) => {

    let body = req.body;

    //Este método regresa solo un usuario
    //Puedo especificar una condición en el primer parámetro
    Empleado.findOne({ nick: body.nick }, (err, usuarioDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }
        //Verificamos si el email de usuario existe
        if (!usuarioDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    mensage: '(Usuario) o contraseña incorrecto'
                }
            })
        }
        Empleado.findByIdAndUpdate(usuarioDB, { password: bcrypt.hashSync(body.password, 10) }, (err, userDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                })
            }
            //Verificamos si el email de usuario existe
            if (!userDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        mensage: 'Error de usuarios al actualizar contraseña'
                    }
                })
            }

            //Especificamos los parámetros que queremos enviar al Front-end
            let empleado = _.pick(usuarioDB, ['_id', 'role', 'nombre', 'nick', 'email']);

            let usuario = {
                ok: true,
                usuario: empleado
            };

            return res.json({
                ok: true,
                user: usuario,
                mensaje: 'Contraseña actualizada'
            })

        });


    });
});


app.get('/actualizar', (req, res) => {
    res.render('actualizar');
});



module.exports = app;
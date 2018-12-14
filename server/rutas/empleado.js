const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const app = express();

const Empleado = require('../modelo/empleado');
const { verificaToken } = require('../middlewares/autenticacion');


app.get('/empleados', verificaToken, (req, res) => {
    Empleado.find()
        .exec((err, usuarioDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                empleado: usuarioDB
            })
        })
})

app.post('/empleado', (req, res) => {

    let body = req.body;

    let empleado = new Empleado({
        nombre: body.nombre,
        nick: body.nick,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    empleado.save((err, empleadoGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            empleado: empleadoGuardado
        })
    })

});


module.exports = app;
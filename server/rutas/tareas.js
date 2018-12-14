const express = require('express');
const mongoose = require('mongoose');

const data = require('../data/data.json');

const app = express();

const { verificaToken } = require('../middlewares/autenticacion');

const Tarea = require('../modelo/tareaSchema');

//Obtener base de datos de parquímetros
app.get('/dataBase', (req, res) => {

    Tarea.find((err, elemDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        return res.json({
            ok: true,
            list: elemDB
        })

    })


})

app.post('/nuevaTarea', (req, res) => {

    let body = req.body;

    let park = data.parkimetros;

    let arrBarrio = park.filter(elem => elem.barrio.startsWith(body.barrio));

    let lista = new Tarea({
        usuario: body.usuario,
        titulo: body.titulo,
        barrio: body.barrio,
        parquimetros: arrBarrio
    });

    lista.save((err, listaGuardado) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        return res.json({
            ok: true,
            titulo: body.titulo,
            list: listaGuardado
        })
    })

})

app.delete('/deleteTarea', (req, res) => {

    let id = req.body.id;
    let usuario = JSON.parse(req.body.usuario);


    Tarea.findById(id, (err, elementDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        } else if (!elementDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        } else if (elementDB.usuario.nick != usuario.nick) {
            return res.status(401).json({
                ok: false,
                user: elementDB.usuario.nombre,
                err: {
                    message: 'No estás autorizado!!'
                }
            });
        } else {

            Tarea.findByIdAndRemove(id, (err, elemDB) => {

                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    });
                }

                if (!elemDB) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'ID no existe'
                        }
                    });
                }

                res.json({
                    ok: true,
                    mensaje: 'Elemento borrado',
                    elemento: elemDB
                });

            })
        }

    })
})
app.put('/updateTarea', async(req, res) => {

    let body = JSON.parse(req.get('tarea'));
    let id = body.id;
    let alias = body.alias;


    Tarea.findById(id, (err, elemDB) => {

        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }

        if (!elemDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'ID no existe'
                }
            });
        }

        elemDB.parquimetros.forEach(element => {

            if (element.alias == alias) {
                element.opacity = .5;
            }

        });

        Tarea.findByIdAndUpdate(id, elemDB, { new: true }, (err, elemUpdate) => {

            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }

            if (!elemUpdate) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'ID no existe'
                    }
                });
            }

            return res.json({
                ok: true,
                elemento: elemUpdate
            })

        })

    });
})


module.exports = app;
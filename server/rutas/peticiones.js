const express = require('express');
const colors = require('colors');


const fs = require('fs');

const app = express();

const _ = require('underscore');

const Met = require('../modelo/metSchema');

const { verificaToken } = require('../middlewares/autenticacion');

app.get('/verification', verificaToken, (req, res) => {

    return res.json({
        ok: true,
        message: 'Toke verificado'
    })
});

//Devolvemos un elemento a la página de '/actualizar'
app.post('/actualiza', verificaToken, (req, res) => {
    let bodyAlias = req.body.alias;
    console.log(bodyAlias);

    Met.findOne({ alias: bodyAlias }, (err, metDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        if (!metDB) {
            return res.status(500).json({
                ok: false,
                mensaje: 'El parquímetro no esta en la base de datos'
            })
        }

        return res.json({
            ok: true,
            met: metDB
        })

    })
})

//Actualizar un parquímetro desde la página de actualizar
app.put('/actualiza', verificaToken, (req, res) => {

    let data = req.body.data;
    let bodyAlias = req.body.data.alias;


    Met.findOneAndUpdate({ alias: bodyAlias }, data, { new: true, runValidators: true }, (err, metDB) => {
        console.log(data);
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }
        return res.json({
            ok: true,
            actualizada: metDB
        })
    })
});


//Obtenemos todos los parquímetros de un barrio seleccionado
app.get('/barrio/:num', verificaToken, (req, res) => {

    const barriosHTML = ["44 Guindalera.", "45 Lista.", "46 Castellana.", "51 El Viso.", "52 Prosperidad.", "53 Ciudad Jardín.", "54 Hispanoamérica.", "55 Nueva España.", "56 Castilla.", "61 Bellas Vistas", "62 Cuatro Caminos.", "63 Castillejos.", "64 Almenara.", "65 Valdeacederas.", "66 Berruguete.", "75 Rios Rosas.", "76 Vallehermoso.", "84 Pilar.", "85 La Paz.", "93 Ciudad Universitaria."];

    let num = req.params.num;
    let cuentas = 0;

    let barrioID = barriosHTML.find((barrio) => {
        return barrio.startsWith(num);
    });
    barrioID = barrioID.toUpperCase();

    Met.find({ barrio: barrioID })
        .sort('alias')
        .exec((err, barrioDB) => {
            if (err) {
                return res.json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                barrio: barrioID,
                mets: barrioDB,
                conteo: barrioDB.length
            })

        })
});



//Añadir un parquímetro a la base de datos
app.post('/met', verificaToken, (req, res) => {

    let body = req.body;

    console.log(body);

    let metNueva = new Met({
        alias: body.alias,
        barrio: body.barrio,
        direccion: body.direccion,
        fabricante: body.fabricante,
        empresa: body.empresa,
        tarifa: body.tarifa,
        latitud: body.latitud,
        longitud: body.longitud,
        estado: body.estado
    });

    metNueva.save((err, metGuardada) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            empleado: metGuardada
        })
    })

});

app.put('/generarJson', verificaToken, async(req, res) => {

    let accion = await crearJsonMets();

    return res.json({
        ok: true,
        mensaje: 'JSON creado correctamente'
    })

})


module.exports = app;

function crearJsonMets() {

    let parquimetros = [];
    Met.find((err, metDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        console.log('parquimetros: ', metDB.length);

        metDB.forEach(elem => {
            let parkimetro = {
                alias: elem.alias,
                barrio: elem.barrio,
                direccion: elem.direccion,
                fabricante: elem.fabricante,
                empresa: elem.empresa,
                tarifa: elem.tarifa,
                latitud: elem.latitud,
                longitud: elem.longitud,
                estado: elem.estado
            }

            parquimetros.push(parkimetro);

        })


        let jsonData = {
                parkimetros: parquimetros
            }
            //Convertir el objeto.json en un string
        let jsonDataString = JSON.stringify(jsonData);

        //Grabar el archivo en data.json
        fs.writeFileSync('./server/data/data.json', jsonDataString);


    });
}
// crearJsonMets();



//Añadir la base de datos de parquímetros a mongodb

// let num = 0;
// baseDatos.forEach(elem => {

//     let met = new Met({
//         alias: elem.alias,
//         barrio: elem.barrio,
//         direccion: elem.direccion,
//         fabricante: elem.fabricante,
//         empresa: elem.empresa,
//         tarifa: elem.tarifa,
//         latitud: elem.latitud,
//         longitud: elem.longitud,
//         estado: true
//     });
//     met.save((err, metDB) => {
//         if (err) {
//             console.log('Error a guardar: ', elem);
//         } else {
//             num++;
//             console.log('Mets guardadas en la base de datos: ', num);
//         }
//     });
// });

//Función para modificar algún parámetro de la base de datos
function actualizarDB() {

    let numero = 0;
    Met.find((err, baseDatosMet) => {
        if (err) {
            return err
        }
        baseDatosMet.forEach(elem => {
            if (elem.estado === 'true') {
                numero++;
                let bodyAlias = elem.alias;

                Met.findOneAndUpdate({ alias: bodyAlias }, { estado: 'activo' }, { new: true, runValidators: true }, (err, metDB) => {
                    if (err) {
                        return err
                    }
                    console.log(metDB.estado);
                })
            }
        })

    })
}
// actualizarDB();
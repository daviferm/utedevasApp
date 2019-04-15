const mongoose = require('mongoose');

//Libreria para realizar validaciones de la base de datos mongodb
const uniqueValidator = require('mongoose-unique-validator');

let estadosValidos = {
    values: ['true', 'activo', 'inactivo', 'desmontada'],
    message: '{VALUE} no es un estado válido'
};


//Asignar a la variable 'Schema' la función de mongoose.Schema
let Schema = mongoose.Schema;

let metsSchema = new Schema({
    alias: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    barrio: {
        type: String
    },
    direccion: {
        type: String
    },
    fabricante: {
        type: String
    },
    empresa: {
        type: String
    },
    tarifa: {
        type: String
    },
    latitud: {
        type: String
    },
    longitud: {
        type: String
    },
    estado: {
        type: String,
        default: true,
        enum: estadosValidos
    }
    // _id: {
    //     type: String
    // }
});

metsSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });


//Exportar el modelo de Schema
module.exports = mongoose.model('Met', metsSchema);
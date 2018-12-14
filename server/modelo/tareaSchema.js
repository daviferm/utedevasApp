const mongoose = require('mongoose');

//Libreria para realizar validaciones de la base de datso mongod
const uniqueValidator = require('mongoose-unique-validator');


//Asignar a la variable 'Schema' la función de mongoose.Schema
let Schema = mongoose.Schema;

let tareaSchema = new Schema({
    usuario: {
        type: Object,
        required: [true, 'El usuario es necesario..']
    },
    titulo: {
        type: String,
        required: [true, 'El título es necesario..']
    },
    barrio: {
        type: String,
        required: [true, 'El barrio es necesario..']
    },
    parquimetros: {
        type: Array,
        required: true
    }
});


//Exportar el modelo de Schema
module.exports = mongoose.model('NuevaTarea', tareaSchema);
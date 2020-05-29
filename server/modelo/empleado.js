// importar la libreria de mongoose para gestionar la DB
const mongoose = require('mongoose');

//Libreria para realizar validaciones de la base de datso mongod
const uniqueValidator = require('mongoose-unique-validator');

//Enumerar roles permitidos
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE', 'ENCARGADO'],
    message: '{VALUE} no es un rol válido'
}

//Asignar a la variable 'Schema' la función de mongoose.Schema
let Schema = mongoose.Schema;

let empleadoSchema = new Schema({
    nombre: {
        type: String,
        unique: true, //Único (parámetro de mongoose-unique-validator)
        required: [true, 'El nombre es necesario'] //obligatorio
    },
    nick: {
        type: String,
        unique: true,
        required: [true, 'El nick es necesario']
    },
    email: {
        type: String,
        unique: true, //Único (parámetro de mongoose-unique-validator)
        required: [true, 'El correo es necesario'] //obligatorio
    },
    password: {
        type: String,
        required: [true, 'La congraseña es obligatoria']
    },
    role: {
        type: String,
        default: 'USER_ROLE', //por defecto
        enum: rolesValidos // El rol debe estar dendtro de los rolesValidos
    }
});

empleadoSchema.plugin(uniqueValidator, { message: '{PATH} debe de ser único' });


//Exportar el modelo de Schema
module.exports = mongoose.model('Empleado', empleadoSchema);
//================================
//  Puerto
//================================

process.env.PORT = process.env.PORT || 3000;

//================================
//  Entorno
//================================

//Variable para saber si estamos trabajando en desarrollo o en producción
//SI NO EXISTE LA VARIABLE ESTAMOS EN DESARROLLO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//================================
//  Base de datos
//================================

let urlDB;

// Su estamos trabajando en desarrollo(variable de entorno heroku)
if (process.env.NODE_ENV === 'dev') {
    //Utilizamos la dirección local de nuestra mac
    urlDB = 'mongodb://localhost:27017/metsDB';
} else {
    urlDB = process.env.MONGO_URI;
}


process.env.URLDB = urlDB;

//================================
//  Vencimiento del token (30 dias)
//================================
process.env.CADUCIDAD_TOKEN = '4h';


//================================
//  SEED (semilla de autenticación)
//================================
// Creamos una variable de desarrollo en heroku para ocultar la semilla de autenticación
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


/*
Comandos para manejar variables de entorno en heroku

heroku config:set MONGO_URI="XXXXXXX"
 
heroku config:get nombre
heroku config:unset nombre
heroku config:set nombre="Fernando"
*/
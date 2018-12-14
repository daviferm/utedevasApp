const jwt = require('jsonwebtoken');

//====================
// Verificar Tokens
//====================

let verificaToken = (req, res, next) => {

    //Optenemos el token de la (CABECERA) de la petición
    let token = req.get('token');

    //Función para verificar el token
    jwt.verify(token, process.env.SEED, (err, decoded) => {

        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Token no válido!',
                    token
                }
            });
        }
        console.log('token verificado!!');
        //Enviamos el usuario en el req para poder recibirlo en la petición
        req.usuario = decoded.usuario;
        //next() deja continuar con el proceso

        next();

    });

};


module.exports = {
    verificaToken
}
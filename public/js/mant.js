'use strict'
//importar funcion
import { verificaUser } from './middleware/virify.js';


//Variables
const $saludo = document.querySelector('.saludo');
const $btnMant = document.querySelector('.divMant');
const $off = document.querySelector('.off');
const $ajustes = document.querySelector('.ajustes');
const $btn_ajustes = document.querySelector('.conf');


$off.addEventListener('click', salirApp);


//ejecutamos una función al cargar la página
document.addEventListener('DOMContentLoaded', verificaUser);

$btnMant.addEventListener('click', function() {
    window.location = './tareas';
})


//Mostrar mensaje de saludo personalizado
let usuario = JSON.parse(sessionStorage.getItem('usuario'));

let nombre = usuario.nombre,
    nick = usuario.nick,
    email = usuario.email,
    id = usuario._id;

let mensaje = `Hola ${nombre}`;

let saludo = document.createElement('p');
saludo.innerHTML = mensaje;
$saludo.appendChild(saludo);


//función para salir de la aplicación
function salirApp() {
    window.location = '/';
}

//Formulario Ajustes
//Variables del formularo Ajustes
const $name = document.getElementById('nombre'),
    $formularo = document.getElementById('form-password'),
    $nick = document.getElementById('nick'),
    $email = document.getElementById('email'),
    $cerrar = document.querySelector('.cerrar'),
    $contrasena = document.getElementsByName('contrasena')[0],
    $confirmar = document.getElementsByName('confirmar')[0];

$name.textContent = nombre;
$nick.textContent = nick;
$email.textContent = email;

$btn_ajustes.addEventListener('click', function() {
    $ajustes.style.top = '0px';
});
$cerrar.addEventListener('click', function() {
    $ajustes.style.top = '105%';
})

$formularo.addEventListener('submit', cambiarPassword);

let token = sessionStorage.getItem('token');

async function cambiarPassword(e) {
    'use strict'
    e.preventDefault();

    if ($contrasena.value.length <= 4 || $confirmar.value.length <= 4) {

        alert('La contraseña tiene que tener mas de 4 caracteres');

    } else if ($contrasena.value != $confirmar.value) {

        alert('Las contraseñas no son iguales');
    } else {
        usuario.password = $contrasena.value;
        let user = JSON.stringify(usuario);

        console.log(user);
        console.log('Formulario enviado...');


        let respuesta = await fetch('/cambiopassword', {
            method: 'POST',
            body: user,
            headers: {
                'Content-Type': 'application/json',
                token
            }
        })

        let content = await respuesta.json();

        if (content.ok) {
            $ajustes.style.bottom = '-100%';
        }

        console.log(content);

    }
}
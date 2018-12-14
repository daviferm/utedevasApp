'use strict'

//variables

const LOGIN = document.querySelector('#loginform');
const NAMELOGIN = document.querySelector('#nameLogin'),
    PASSWORD = document.querySelector('#passwordLogin'),
    LINOMBRES = document.querySelector('.listaNombres'),
    selectUser = document.getElementById('empleados'),
    SPINNER = document.querySelector('.contenido');



LOGIN.addEventListener('submit', enviarLogin);



async function enviarLogin(e) {
    e.preventDefault();

    const user = selectUser.options[selectUser.selectedIndex].value;
    var usuario = {
        nombre: user,
        password: PASSWORD.value
    };

    const respuesta = await fetch('/login', {
        method: 'POST',
        body: JSON.stringify(usuario),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const content = await respuesta.json();

    if (!content.ok) {
        alert(content.err.mensage);
    } else {
        console.log(content);
        var token = content.token;
        var usuario = JSON.stringify(content.usuario);

        sessionStorage.setItem('token', token);
        sessionStorage.setItem('usuario', usuario);

        SPINNER.style.display = "block";

        window.location = './mantenimiento';
        setTimeout(() => {
            SPINNER.style.display = "none";
        }, 2500);

    }
}
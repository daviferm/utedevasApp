//Variable boton mantenimiento
const $spinner = document.querySelector('.content-spp');
const $contenido = document.querySelector('.contenido');


//Verifica que el empleado se a autenticado
export async function verificaUser() {

    let token = sessionStorage.getItem('token');

    let content = await fetch('./autentificar', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            token
        }
    })

    let respuesta = await content.json();


    if (!respuesta.ok) {
        setTimeout(function() {
            window.location = './';
        }, 100);
    } else {
        console.log(respuesta);
        $contenido.style.display = 'flex';
        $spinner.style.display = 'none';
    }
}
'use strict'

//importar funcion
import { verificaUser } from './middleware/virify.js';
import { Mapa } from './classes/mapa.js';

//importar la clase para crear tareas
import { Tarea } from './classes/newTares.js';


//ejecutamos una función al cargar la página
document.addEventListener('DOMContentLoaded', verificaUser);
document.addEventListener('DOMContentLoaded', actualizarTareas);


const $listaUl = document.getElementById('lista-ul');
const $off = document.querySelector('.off');
const $mapa = document.querySelector('.mapa');
const $barras = document.querySelector('.bars');
const position = document.querySelector('.posicionGps');
const $spinner = document.querySelector('.cajaspinner');
const $contentTareas = document.querySelector('.content');


$barras.addEventListener('click', ocultarMapa);


//Arreglo para guardar localmente todas las tareas que hay en la base de datos mongod
let arregloLi = [];

//Boton para salir de la aplicación
$off.addEventListener('click', function() {
    window.location = '/';
});

//Comando para establecer la conexión socket
// var socket = io();

/*
socket.on('connect', function() {

    console.log('Conectado al servedor desde lista de tareas..');

    let usuario = JSON.parse(sessionStorage.getItem('usuario'));

    socket.emit('userConection', usuario, function(usuarios) {
        console.log(usuarios)
    });

});
socket.on('crearMensaje', function(mensaje) {
    console.log(mensaje);
});

socket.on('listaEmpleados', function(empleados) {
    console.log(empleados);
});



socket.on('disconnect', function() {

    console.log('Desconectado del servidor (lista de tareas)...');

    let usuario = JSON.parse(sessionStorage.getItem('usuario'));

});*/

//llenar selected lista barrios
//Variables globales
const selectBarrio = document.getElementById('barrio');
let token = sessionStorage.getItem('token');


//Llenamos el listado de barrios
const barriosHTML = ["44 Guindalera", "45 Lista", "46 Castellana", "51 El Viso", "52 Prosperidad", "53 Ciudad Jardín", "54 Hispanoamérica", "55 Nueva España", "56 Castilla", "61 Bellas Vistas", "62 Cuatro Caminos", "63 Castillejos", "64 Almenara", "65 Valdeacederas", "66 Berruguete", "75 Rios Rosas", "76 Vallehermoso", "84 Pilar", "85 La Paz", "93 Ciudad Universitaria"];
const listaBarrios = [44, 45, 46, 51, 52, 53, 54, 55, 56, 61, 62, 63, 64, 65, 66, 75, 76, 84, 85, 93];

//Llenamos el select con la lista de barrios
for (let i = 0; i < listaBarrios.length; i++) {
    let option = document.createElement('option');
    option.value = listaBarrios[i];
    option.innerHTML = barriosHTML[i];
    selectBarrio.appendChild(option);
};

document.querySelector('#formulario').addEventListener('submit', nuevaTarea);

//Muestra el mapa con todos los parkímetros del barrio seleccionado
async function nuevaTarea(e) {
    e.preventDefault();

    let usuario = JSON.parse(sessionStorage.getItem('usuario'));

    const barrioSeleccionado = selectBarrio.options[selectBarrio.selectedIndex].value;

    if (barrioSeleccionado == 0) {
        alert("Tienes que seleccionar un barrio");
    } else {
        const { value: name } = await swal({
            title: 'Tareas de mantenimiento.',
            input: 'text',
            inputPlaceholder: 'Escrique título para la nueva tarea..',
            showCancelButton: true,
            inputValidator: (value) => {
                return !value && 'Necesitas escribir un título válido!'
            }
        })

        if (name) {
            await swal({ type: 'success', title: 'Tarea "' + name + '" guardada..' })


            let nuevaTarea = new Tarea(name, barrioSeleccionado);

            let li = await nuevaTarea.crearLi()
                .then(async(resp) => {
                    let respuesta = await resp;
                    return respuesta;
                })

            $listaUl.appendChild(li.li);
            li.li.addEventListener('click', mostrarMapa);

            let listSave = await nuevaTarea.guardarLiDb(barrioSeleccionado, name, usuario, li.li);

            arregloLi.push(listSave.list);
            console.log(arregloLi);
            // socket.emit('nuevaTarea');
        }
    }
}

//Actualizar las tareas que hay en la base de datos
async function actualizarTareas() {

    $spinner.style.display = 'block';

    $listaUl.innerHTML = '';

    let tareas = await fetch('/dataBase', {
            method: 'GET',
            headers: {
                token
            }
        })
        .then(async(resp) => {
            let respuesta = await resp.json();
            $spinner.style.display = 'none';
            return respuesta;
        })
    arregloLi = tareas.list;

    tareas.list.forEach(async(element) => {

        let listPark = element.parquimetros;
        let contEcho = listPark.filter(el => el.opacity == 0.5);

        let nuevaTarea = new Tarea(element.titulo, element.barrio, element._id, contEcho.length);

        let li = await nuevaTarea.crearLi()
            .then(async(resp) => {
                let respuesta = await resp;
                return respuesta;
            })

        $listaUl.appendChild(li.li);
        li.li.addEventListener('click', mostrarMapa);

    });

}
let mapa;

function mostrarMapa(e) {
    if (e.target.parentElement.parentElement.className === 'titulo') {
        let elementoID = e.target.parentElement.parentElement.parentElement.getAttribute('data-id');

        let objMap = arregloLi.find(elem => elem._id == elementoID);

        let latLng = optenerCentro(objMap.barrio);

        mapa = new Mapa(15, latLng);
        mostrarPines(mapa, objMap);

        $mapa.style.display = 'block';
        $mapa.classList.add('fadeIn');
        $contentTareas.style.display = 'none';
        window.scrollBy(0, -window.innerHeight);


        position.addEventListener('click', () => {
            getPosicion();
        });


    }

}

//Ocultar mapa
function ocultarMapa() {
    $contentTareas.style.display = 'block';

    actualizarTareas();

    $mapa.classList.remove('fadeIn');
    $mapa.classList.add('fadeOut');

    setTimeout(function() {

        $mapa.classList.remove('fadeOut');
        $mapa.style.display = 'none';

    }, 400);
}

function mostrarPines(mapa, arreglo) {


    let arregloMets = arreglo.parquimetros;

    arregloMets.forEach(elem => {

        let iconMap = '../assets/images/icono-google.png';

        let { latitud, longitud, alias, opacity, estado } = elem;
        let contenido = `
                 <div class="infoPark" data-id=${arreglo._id}>
                     <p>Número: ${alias}</p>
                     <div class="buttons">
                        <div class="divBtnInfo">
                            <button id="btnInfo" type="button">Tarea realizada</button>
                        </div>
                        <div class="divBtnMap">
                            <button id="btnMap" type="button"></button>
                        </div>
                     </div>
                 </div>
         `;


        opacity = undefined ? 1 : opacity;

        let latLng = {
            lat: Number(latitud),
            lng: Number(longitud)
        }
        let endAlias = alias.substr(alias.length - 3, alias.length);

        if (estado != 'desmontada') {

            mapa.mostrarPin(latLng, contenido, opacity, name, endAlias);

        }

    })
}

//Obtener posición GPS
let getPosicion = () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            position = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
            let latLng = {
                lat: position.lat,
                lng: position.lng
            }
            let miPosicion = mapa.mostrarPosicion(latLng);


        });

    } else {
        throw error = new Error('Necesitas habilitar GPS!');
    }
}



// =======================================
//  MANEJAR MAPA
// =======================================


//Optener cetro del mapa según el barrio
function optenerCentro(barrio) {
    let numBarrio = Number(barrio);
    let centro;
    switch (numBarrio) {
        case 44:
            centro = { lat: 40.436347, lng: -3.667389 };
            break;
        case 45:
            centro = { lat: 40.432375, lng: -3.676183 };
            break;
        case 46:
            centro = { lat: 40.433368, lng: -3.683588 };
            break;
        case 51:
            centro = { lat: 40.445408, lng: -3.684342 };
            break;
        case 52:
            centro = { lat: 40.443262, lng: -3.669103 };
            break;
        case 53:
            centro = { lat: 40.448204, lng: -3.67265 };
            break;
        case 54:
            centro = { lat: 40.455497, lng: -3.677462 };
            break;
        case 55:
            centro = { lat: 40.461893, lng: -3.679066 };
            break;
        case 56:
            centro = { lat: 40.472714, lng: -3.677789 };
            break;
        case 61:
            centro = { lat: 40.451753, lng: -3.707646 };
            break;
        case 62:
            centro = { lat: 40.452326, lng: -3.696489 };
            break;
        case 63:
            centro = { lat: 40.459081, lng: -3.693029 };
            break;
        case 64:
            centro = { lat: 40.469211, lng: -3.69408 };
            break;
        case 65:
            centro = { lat: 40.466564, lng: -3.702468 };
            break;
        case 66:
            centro = { lat: 40.459403, lng: -3.704318 };
            break;
        case 75:
            centro = { lat: 40.441979, lng: -3.698296 };
            break;
        case 76:
            centro = { lat: 40.441833, lng: -3.71095 };
            break;
        case 84:
            centro = { lat: 40.476389, lng: -3.708886 };
            break;
        case 85:
            centro = { lat: 40.48158, lng: -3.697391 };
            break;
        case 93:
            centro = { lat: 40.449879, lng: -3.714955 };
            break;
    }

    return centro;
}
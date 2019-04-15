'use strict'

//ejecutamos una función al cargar la página
document.addEventListener('DOMContentLoaded', verificaUser);

//Verifica que el empleado se a autenticado
async function verificaUser() {

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
        window.location = './';
    } else {
        console.log(respuesta);
    }

}

function $(id) {
    return document.querySelector(id);
}

const $buscador = $('#buscarMet'),
    $actualizar = $('#formActualizar'),
    $administra = $('#administra'),
    $actualizado = $('#actualizado'),
    $alias = $('.alias'),
    $aliasID = $('#alias'),
    $idMet = $('#idMet'),
    $barrio = $('#barrio'),
    $direccion = $('#direccion'),
    $fabricante = $('#fabricante'),
    $tarifa = $('#tarifa'),
    $empresa = $('#empresa'),
    $latitud = $('#latitud'),
    $longitud = $('#longitud'),
    $estado = $('#estado'),
    $generarJOSN = $('#generarJson');

let resultId;
//EventListeners
$buscador.addEventListener('submit', buscarParkimetro);
$actualizar.addEventListener('submit', actualizarParkimetro);
$generarJOSN.addEventListener('click', generarJSON);

//Funciones
async function buscarParkimetro(e) {
    e.preventDefault();

    let token = sessionStorage.getItem('token');

    if ($alias.value.length !== 10) {

        $alias.style.borderColor = 'red';
        $alias.style.borderWidth = '4px';
        console.error('error número');
    } else {
        var url = '/actualiza';
        var data = {
            alias: $alias.value,
            token
        }

        let repuestaJson = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        });

        const content = await repuestaJson.json();

        if (!content.ok) {
            return console.log(content.mensaje);
        }
        console.log(content);

        // //Llenar el formulario con los datos del parquímetro

        $aliasID.textContent = content.met.alias;
        $idMet.textContent = content.met._id;
        $barrio.value = content.met.barrio;
        $direccion.value = content.met.direccion;
        $fabricante.value = content.met.fabricante;
        $tarifa.value = content.met.tarifa;
        $empresa.value = content.met.empresa;
        $latitud.value = content.met.latitud;
        $longitud.value = content.met.longitud;
        $estado.value = content.met.estado;

        // //Eliminar color y grosor del borde error
        $alias.style.borderColor = '';
        $alias.style.borderWidth = '';

    }
    $actualizado.textContent = '';

}

async function actualizarParkimetro(e) {
    e.preventDefault();

    let token = sessionStorage.getItem('token');

    var metDB = {
        alias: $aliasID.textContent,
        barrio: $barrio.value,
        direccion: $direccion.value,
        fabricante: $fabricante.value,
        empresa: $empresa.value,
        tarifa: $tarifa.value,
        latitud: $latitud.value,
        longitud: $longitud.value,
        estado: $estado.value
    }

    var url = '/actualiza';
    var data = {
        data: metDB
    }

    let repuestaJson = await fetch(url, {
        method: 'PUT',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json',
            'token': token
        }
    });

    const content = await repuestaJson.json();

    console.log(content.actualizada);

    let metActualizada = content.actualizada;

    let HTML = `
        <h3>${metActualizada.alias}</h3>
        <p>Barrio: ${metActualizada.barrio}</p>
        <p>Dirección: ${metActualizada.direccion}</p>
        <p>Fabricante: ${metActualizada.fabricante}</p>
        <p>Tarifa: ${metActualizada.tarifa}</p>
        <p>Empresa: ${metActualizada.empresa}</p>
        <p>Latitud: ${metActualizada.latitud}</p>
        <p>Longitud: ${metActualizada.longitud}</p>
        <p>Estado: ${metActualizada.estado}</p>
    `;

    $actualizado.innerHTML = HTML;

}

async function generarJSON() {
    console.log('Generar JSON');

    let token = sessionStorage.getItem('token');

    let jsonMet = await fetch('/generarJson', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'token': token
            }
        })
        .then(async(resp) => {
            let respuesta = await resp.json();
            return respuesta;
        })

    console.info(jsonMet);
}

//añadir el archivo data.json a la base de datos Mongod
async function llenarMogo() {

    let token = sessionStorage.getItem('token');

    let data = await fetch('../../data/data.json')
        .then(async function(resp) {
            let respuesta = await resp.json();
            return respuesta;
        })

    let arrData = data.parkimetros;
    // console.log(arrData);

    arrData.forEach(elem => {

        let data = {
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


        const objMet = fetch('/met', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json',
                    'token': token
                }
            })
            .then(async(resp) => {
                let respuesta = await resp.json();
                return respuesta;
            })

    });


}

// llenarMogo();
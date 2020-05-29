//clase para manejar la api de google maps

export class Mapa {
    constructor(zoom, latLng) {
        //Inicializar y obtenet la propiedad de mapa
        this.mapa = new google.maps.Map(document.getElementById('map'), {
            center: latLng,
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            zoomControl: false,
            gestureHandling: "greedy", //mover el mapa con un dedo
            zoom: zoom
        });

        this.infoWindowActivo;
        this.mapa.addListener('click', (e) => {
            // Cerrar infoWindowActivo
            if (this.infoWindowActivo) {
                this.infoWindowActivo.close();
            }
        });
    }

    mostrarPin(latLng, contenido, opacidad, name, alias) {
        let marker = new google.maps.Marker({
            position: latLng,
            map: this.mapa,
            opacity: opacidad,
            icon: '../../assets/images/icono-position.png',
            animation: google.maps.Animation.DROP,
            label: alias,
            title: 'Parkímetro'
        });

        let infowindow = new google.maps.InfoWindow({
            content: contenido
        });

        // Mostrar InfoWindow al hace click
        marker.addListener('click', (e) => {
            // Cerrar infoWindowActivo
            if (this.infoWindowActivo) {
                this.infoWindowActivo.close();
            }
            // Mostrarlo
            infowindow.open(this.mapa, marker);

            let targetId;
            let alias;

            // Añadir un evento click al boton del infoWindow para marcarlo con hecho
            setTimeout(function() {

                let boton = document.getElementById('btnInfo');
                let btnMap = document.getElementById('btnMap');
                boton.addEventListener('click', (e) => {

                    let targetDiv = e.target.parentElement.parentElement.parentElement;

                    targetId = targetDiv.getAttribute('data-id');
                    let stringAlias = targetDiv.textContent.trim();

                    alias = stringAlias.match(/\d{10}/)[0];

                    marker.setOptions({ opacity: .5 });
                    infowindow.close();
                    // marker.setMap(null);

                    actualizarDB(targetId, alias);
                })
                btnMap.addEventListener('click', () => {

                    window.open("https://www.google.es/maps/dir/mi+ubicacion/" + latLng.lat + "," + latLng.lng + "/");

                })
            }, 500);

            //Asignar activo
            this.infoWindowActivo = infowindow;

        })

    }

    mostrarPosicion(latLng) {

        let marker = new google.maps.Marker({
            position: latLng,
            icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 9, //tamaño
                strokeColor: 'white', //color del borde
                strokeWeight: 5, //grosor del borde
                fillColor: '#00f', //color de relleno
                fillOpacity: 1 // opacidad del relleno
            },
            map: this.mapa
        })

        return marker;

    }

}

async function actualizarDB(id, alias) {

    let tarea = {
        id: id,
        alias: alias
    }

    let update = await fetch('./updateTarea', {
        method: 'PUT',
        headers: {
            'tarea': JSON.stringify(tarea)
        }
    }).then(resp => {
        return resp.json();
    })

    console.log(update);
}
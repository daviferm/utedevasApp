'use strict'

//Clase para manejar las tareas

let bgcolor = true;

export class Tarea {

    constructor(titulo, barrio, id, num) {
        this.titulo = titulo;
        this.barrio = barrio;
        this.id = id;
        this.num = num;
    }

    async crearLi() {


        let arrBarrio = await this.obtData(this.barrio);

        let cont = arrBarrio.length;

        let li = document.createElement('li');

        if (bgcolor) {
            li.className = 'liServicios bg_blue';
        } else {
            li.className = 'liServicios bg_green';
        }

        li.setAttribute("data-id", this.id);
        let html = `
            <div class="titulo">
                <div class="divTitulo">
                    <p> ${this.titulo} </p> 
                </div>
            </div>
            <div class="barrio">
                <div>
                <p>Barrio: <strong> ${this.barrio} </strong></p>
                </div>
                <div class="cont">
                    <div>
                        <p> ${cont - this.num} / ${cont}  </p>
                    </div>
                </div>
            </div>
            <div class="cerrar">
                <p><strong>x</strong></p>
            </div>
        `
        li.innerHTML = html;
        li.addEventListener('click', this.accionLi);

        bgcolor = !bgcolor;

        return {
            li: li,
            data: arrBarrio
        }

    }

    async accionLi(e) {
        if (e.target.parentElement.parentElement.className === 'cerrar') {

            let id = e.target.parentElement.parentElement.parentElement.getAttribute("data-id");

            let usuario = sessionStorage.getItem('usuario');
            let data = { id: id, usuario: usuario };
            let liBorrado;

            let alert = await swal({
                    title: 'Estás seguro?',
                    text: `Se borrará la tarea`,
                    type: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Si, borrarla!'
                }).then(async(result) => {
                    if (result.value) {

                        liBorrado = await fetch('./deleteTarea', {
                                method: 'DELETE',
                                body: JSON.stringify(data),
                                headers: {
                                    'Content-Type': 'application/json'
                                }
                            })
                            .then(async(resp) => {
                                let respuesta = await resp.json();
                                console.log(respuesta);
                                return respuesta;
                            });

                        if (liBorrado.ok) {

                            e.target.parentElement.parentElement.parentElement.remove();
                            swal({

                                type: 'success',
                                text: 'Tarea Eliminada!'
                            })

                        } else {
                            swal({
                                type: 'error',
                                title: 'Oops...',
                                text: liBorrado.err.message,
                                footer: `Tarea creada por ${liBorrado.user}`
                            })
                            console.log(liBorrado);
                        }
                    }
                })
                // socket.emit('nuevaTarea');

        }

    }

    async obtData(barrio) {

        let data = await fetch('../../data/data.json')
            .then(async function(resp) {
                let respuesta = await resp.json();
                return respuesta;
            })

        let arrData = data.parkimetros;
        let arrBarrio = arrData.filter((elem) => elem.barrio.startsWith(barrio));

        return arrBarrio;

    }

    async guardarLiDb(barrio, name, user, link) {

        let data = { barrio: barrio, titulo: name, usuario: user };

        let DB = await fetch('./nuevaTarea', {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            .then(async function(res) {
                let respuesta = await res.json();
                return respuesta;
            });

        link.setAttribute("data-id", DB.list._id);

        return DB;

    }

}
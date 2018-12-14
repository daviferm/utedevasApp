class Usuarios {

    constructor() {
        this.personas = [];
    }

    agregarPersona(id, nombre) {

        let persona = { id, nombre };
        //Agregamos la persona agregada al chat al arreglo de personas
        this.personas.push(persona);

        //Retornamos el arreglo de las personas del chat
        return this.personas;
    }

    getPersona(id) {
        //Busca una usuarios por el id en el arreglo de personas conectadas
        let persona = this.personas.find(persona => persona.id === id);

        return persona;
        //Si encuentra una persona tendremos un objeto con sus datos,
        //si no, retornará un undefined o null
    }

    getPersonas() {
        //Retorna un arreglo con todos los usuarios
        return this.personas;
    }


    //Eliminar una persona del arreglo cuando se desconecte del chat
    borrarPersona(id) {
        //Obtenemos la persona a eliminar
        let personaBorrada = this.getPersona(id);

        //Reemplazamos el arreglo de personas por otro sin la persona eliminada
        this.personas = this.personas.filter(persona => persona.id != id);

        return personaBorrada;
    }

}

module.exports = {
    Usuarios
}
const mongoose = require("mongoose");
const { Reserva } = require("../modelos/reservas");

function representarReserva(documento) { //Esta funcion sirve para representar los datos
  return {
    id: documento._id.toString(), //Tomamos el _id. del documento, lo convertimos a texto y lo entregamos como id junto a los campos de Reserva
    estudiante: documento.estudiante,
    email: documento.email,
    sala: documento.sala,
    fecha: documento.fecha,
    turno: documento.turno,
    personas: documento.personas,
    estado: documento.estado,
  };
}

function crearServicioReservasMongo() {

  async function listar(sala) { ////IMPORTANTE APRENDER* de controladores/reservas recibe la funcion listar con el parametro sala, que es un filtro opcional que se puede pasar en la url para filtrar las reservas por sala. Ej: /api/reservas?sala=Aula%201 
    const filtro = {}; //creamos una constante filtro vacio
    if (sala !== undefined) { //!== es un operador que significa "no es igual a". En este caso, estamos comprobando si sala es diferente de undefined. Si sala es undefined, significa que no se ha proporcionado un valor para la categoría y no se aplicará ningún filtro.
      if (typeof sala !== "string" || !sala.trim()) { //comprobamos que sea un texto y que no quede vacio(a esto lo hacemos con trim)
        const error = new Error("Sala inválida");
        error.codigo = "FILTRO_INVALIDO";
        throw error;
      } 
      filtro.sala = sala.trim();
    }

    const documentos = await Reserva.find(filtro).lean(); //Esta constante documentos guarda el resultado de la busqueda de reservas en la base de datos. Reserva.find(filtro).lean() es un metodo de Mongoose que devuelve los documentos como objetos JavaScript simples, en lugar de instancias de Mongoose. Esto es útil para mejorar el rendimiento y simplificar el código al trabajar con los datos obtenidos de la base de datos.
    return documentos.map(representarReserva); //retorna un arreglo de reservas representados, es decir, con el formato que queremos devolver al cliente. Esto se hace con map(),  que aplica la función representarReserva a cada elemento del arreglo documentos y devuelve un nuevo arreglo con los resultados. 
  }
  // *lean() convierte los documentos de Mongoose en objetos JavaScript simples, lo que permite acceder a sus propiedades directamente sin necesidad de utilizar métodos de Mongoose. Esto es útil para mejorar el rendimiento y simplificar el código al trabajar con los datos obtenidos de la base de datos.

  async function contar(){
    return await Reserva.countDocuments({}); //Esta funcion cuenta la cantidad de documentos en la colección reservas y devuelve el resultado. countDocuments() es un metodo de Mongoose que cuenta los documentos que coinciden con el filtro. En este caso, no se aplica ningún filtro, por lo que cuenta todos los documentos de la colección reservas.
  }
  
  async function obtenerPorId(id) {
    if (!mongoose.isObjectIdOrHexString(id)) { // Si mongoose no es valido. isObjectIdOrHexString() es un metodo que verifica si el id es un ObjectId válido o una cadena hexadecimal de 24 caracteres. Si no lo es, lanzamos un error con un mensaje y un código de error. 
      const error = new Error("Identificador inválido");
      error.codigo = "ID_INVALIDO";
      throw error; //y tira error
    }
    //Si mongoose es valido
    const documento = await Reserva.findById(id).lean();
    return documento ? representarReserva(documento) : null; // documento ? (Si documento existe, se representa con representarReserva(documento)) : (Si no existe, devuelve null)
  }

  async function crear(datos) {
    const documento = await Reserva.create({
      //no usa _id, de eso se encarga mongodb
      estudiante: datos.estudiante,
      email: datos.email,
      sala: datos.sala,
      fecha: datos.fecha,
      turno: datos.turno,
      personas: datos.personas,
      //tampoco se agrega el estado
    });
    return representarReserva(documento);
  }
  return { listar, obtenerPorId, crear, contar };
}
module.exports = { crearServicioReservasMongo }; //Esta funcion se exporta a index.js
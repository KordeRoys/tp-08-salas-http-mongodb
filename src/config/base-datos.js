//En esta carpeta vamos a utilizar el modulo mongoose para conectar a la base de Datos de MongoDB, y vamos a crear un archivo base-datos.js que va a contener la logica de conexion y desconexion a la base de datos, y vamos a crear un archivo entorno.js que va a contener la logica de lectura de variables de entorno, como el puerto y la URI de MongoDB.

const mongoose = require("mongoose");
const dns = require("node:dns");
const { leerUriMongo } = require("./entorno.js"); //Traemos la funcion Leer de entorno.js

// Corrección utilizada en el aula para las consultas DNS de Atlas.
dns.setServers(["8.8.8.8", "1.1.1.1"]);

async function conectarBaseDatos() {
  await mongoose.connect(leerUriMongo(), {
    //conectar con el metodo de mongoose connect con la URI traida de entorno
    serverSelectionTimeoutMS: 5000,
  });
}
async function desconectarBaseDatos() {
  await mongoose.disconnect(); //desconectar y desconectar con el metodo disconnect
}
module.exports = { conectarBaseDatos, desconectarBaseDatos };

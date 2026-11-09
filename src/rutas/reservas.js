// Esta funcion se va a exportar a app.js

const express = require("express");
const {
  prepararAreaReservas,
  validarDatosReserva,
} = require("../middleware/reservas");

function crearRouterReservas(reservaControlador) {
  const router = express.Router();
  router.use(prepararAreaReservas); //prepararAreaReservas es un middleware que se va a ejecutar antes de cualquier ruta, y va a setear la variable res.locals.seccion con el valor "Solicita reserva", que luego se va a usar en la vista para mostrar el titulo de la pagina.

  router.get("/", reservaControlador.listar); //listar, mostratFormulario, mostrarDetalle, crear, verEstado no vienen de ./controlador/reservas, sino que es solo el parametro que se le pasa a la funcion crearRouterReservas, y van a usar los endpoints
  router.get("/nueva", reservaControlador.mostrarFormulario); //mostrarFormulario es una funcion que se va a ejecutar cuando se haga un GET a /reservas/nueva, y va a renderizar la vista reservas/nueva.ejs
  router.get("/estado", reservaControlador.verEstado);
  router.get("/:id", reservaControlador.mostrarDetalle);
  router.post("/", validarDatosReserva, reservaControlador.crear); //validarDatosReserva es lo que primero se llama, si esto sale bien recien llama al Next que entra a reservaControlador.crear, que es la funcion que se va a ejecutar cuando se haga un POST a /reservas, y va a crear una nueva reserva. 
  return router;
}
module.exports = { crearRouterReservas }; //estos modulos se exportan app.js

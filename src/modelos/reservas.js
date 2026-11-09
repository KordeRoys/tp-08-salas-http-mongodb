/*Ya tenemos conexión, pero todavía no explicamos qué es un producto válido. Guardamos esa definición en
src/modelos/reservas.js para que no dependa del formulario ni de una ruta HTTP. */

const mongoose = require("mongoose");
const reservasSchema = new mongoose.Schema(
  {
    estudiante: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, match: /@/ }, // /@/ nos permite validar que el email contenga un @
    sala: {
      type: String,
      required: true,
      enum: ["Sala Norte", "Sala Sur", "Sala Multimedia"],
    }, //enum es una propiedad que nos permite elegir entre varios datos
    fecha: { type: String, required: true, trim: true },
    turno: { type: String, required: true, enum: ["Mañana", "Tarde", "Noche"] },
    personas: {
      type: Number,
      required: true,
      min: 1,
      max: 6,
      validate: {
        validator: Number.isInteger,
        message: " La cantidad debe ser en enteros",
      },
    },
    estado: { //TP8, Agregamos estado, este estado sirve para saber si la reserva esta pendiente o confirmada 
      type: String,
      enum: ["pendiente", "confirmado"],
      default: "pendiente",
    },
  },
  { collection: "reservas" }, //reservas va a ser el nombre de la carpeta en la base de datos. Collection es una propiedad de mongoose que nos permite definir el nombre de la colección en la base de datos. Si no se define, mongoose le asigna un nombre por defecto.
);
const Reserva = mongoose.model("Reserva", reservasSchema);
module.exports = { Reserva }; //Esta validacion se exporta a al archivo scripts/crear-reservas.js para que pueda ser usado allí.

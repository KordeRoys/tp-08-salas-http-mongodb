/*Creamos una entrada dedicada a escribir. Importa el modelo, conecta y ejecuta await Producto.create(...)
.create valida y guarda: el mensaje de éxito se imprime después de esa operación. No usamos push , no
reescribimos el JSON y no calculamos un ID numérico. */
const {
  conectarBaseDatos,
  desconectarBaseDatos,
} = require("../src/config/base-datos");
const { Reserva } = require("../src/modelos/reservas");

async function main() {
  //Estas funciones siempre son asincronas
  try {
    await conectarBaseDatos();
    const reserva = await Reserva.create({
      estudiante: "Abel",
      email: "LocoAbel@gmail.com",
      sala: "Sala Norte",
      fecha: "2026-10-22",
      turno: "Tarde",
      personas: 5,
    });
    console.log("Reserva archivada. _id:", reserva._id.toString()); // reserva._id.toString() sirve para convertir el _id de ObjectId a string y poder imprimirlo en la consola. el _id proviene de MongoDB
  } finally {
    await desconectarBaseDatos();
  }
}
main().catch((error) => {
  //main().catch((error) => { sirve para capturar cualquier error que ocurra en la funcion main y mostrarlo en la consola. Esto es importante para poder depurar el codigo y saber que paso mal.
  console.error("No se pudo crear la reserva:", error.name);//error.name nos devuelve el nombre del error, por ejemplo ValidationError, CastError, etc. El tipo de error los saca del tipo de error que arroje Mongoose.
  if (error.errors) {
    console.error("Campos a revisar:", Object.keys(error.errors).join(", ")); //Object.keys(error.errors) nos devuelve un array con los nombres de los campos que tienen errores de validacion. join(", ") nos devuelve un string con los nombres de los campos separados por coma y espacio.
  }
  console.error("Revisar datos, configuración y disponibilidad de MongoDB.");
  process.exitCode = 1;
});

/* Anotar el _id impreso. Debe volver el prompt: el proceso terminó. En el proyecto de Atlas, abrir Data Explorer
(también puede aparecer como Browse Collections), seleccionar mercado_artesanal_u7 , colección
productos , y actualizar la vista. Localizar el documento por su _id . No insertar otro desde el panel para
reemplazar la escritura del programa.

Si no aparece el mensaje de guardado, no dar por hecha la escritura. Revisar primero la conexión y luego los
campos. No borrar datos para «hacer que funcione».*/

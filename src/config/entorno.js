function leerConfiguracion(entorno = process.env) {
  const puerto = Number(entorno.PORT ?? 3000);
  if (!Number.isInteger(puerto) || puerto < 1 || puerto > 65535) {
    throw new Error("PORT debe ser un entero entre 1 y 65535");
  }
  const formatoRegistro =
    entorno.NODE_ENV === "production" ? "combined" : "dev";
  return { puerto, formatoRegistro };
}

//leerUriMongo Va a ser agregada a donde antes seria la carpeta configuracion, en este caso para a ser entonrno.js
//Esto va a leer el archivo .env y de ahi nva a sacar el valor de la variable de entorno MONGODB_URI, si no encuentra va a tirar el mensaje de error, si Lo encuentra va a usar el metodo startsWith y va a iniciar
function leerUriMongo(entorno = process.env) {
  const uri = entorno.MONGODB_URI?.trim();
  if (!uri) {
    throw new Error("Falta MONGODB_URI en el entorno.");
  }
  if (!uri.startsWith("mongodb://") && !uri.startsWith("mongodb+srv://")) {
    throw new Error(
      "MONGODB_URI debe comenzar con mongodb:// o mongodb+srv://.",
    );
  }
  return uri;
}
module.exports = { leerConfiguracion, leerUriMongo };

//Este archivo va a recibir los errores que llegan al manejador

function crearManejadorErrores({ vistaFormulario, tituloFormulario }) {
    return function manejarErrores(error, req, res, next) {
        //Si la respuesta ya comenzo a enviarse
        if (res.headersSent) { 
            return next(error);//Va a delegar el error con next
        }
        const esValidacion = error.name === "ValidationError";
        const esEntrada =
            esValidacion ||
            error.codigo === "ID_INVALIDO" ||
            error.codigo === "FILTRO_INVALIDO" ||
            error.type === "entity.parse.failed";
        const estado = esEntrada ? 400 : 500; //Dependiendo el error o muestra 400 (La solicitud tiene una sintaxis inválida o Faltan datos obligatorios) 0 500 (Error Falla inesperada del servidor)
        let mensaje = esEntrada
            ? "Revisá los datos enviados." //Y luego muestra el mensaje
            : "No se pudo completar la operación.";
        //Si el id es invalido
        if (error.codigo === "ID_INVALIDO") {
            mensaje = "El identificador debe tener 24 caracteres hexadecimales.";
        }
        console.error("Solicitud fallida:", res.locals.solicitudId, error.name);
        //Si
        if (req.path.startsWith("/api/")) {//Si la peticion corresponde a la api
            return res.status(estado).json({ //va a responder un JSON
                error: mensaje,
                campos: esValidacion ? Object.keys(error.errors) : [],
            });
        }
        if (esValidacion && req.method === "POST") {
            return res.status(400).render(vistaFormulario, {
                titulo: tituloFormulario,
                error: mensaje,
                valores: req.body ?? {},
            });
        }
        return res.status(estado).render("no-encontrado", {
            codigo: estado,
            titulo: esEntrada ? "Solicitud inválida" : "Error del servicio",
            mensaje,
        });
    };
}
module.exports = { crearManejadorErrores }; //Esto se va a exportar a app.js para que pueda ser usado como middleware de manejo de errores.
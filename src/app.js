const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const morgan = require("morgan");
const path = require("node:path");
const {
    identificarSolicitud,
    medirDuracion,
} = require("./middleware/solicitudes");
const { crearManejadorErrores } = require("./middleware/errores"); //TP8 Agregamos manejo de errores 
const { crearControladorReservas } = require("./controladores/reservas"); // controladores/reservas.js
const { crearRouterReservas } = require("./rutas/reservas"); // rutas/reservas.js
const { crearRouterReservasApi } = require("./rutas/reservas-api"); // rutas/api-reservas.js

function crearApp({ servicioReservas, formatoRegistro }) {
    const app = express();
    const controladorReservas = crearControladorReservas(servicioReservas);
    const reservasRouter = crearRouterReservas(controladorReservas);

    app.set("view engine", "ejs");
    app.set("views", path.join(__dirname, "..", "views"));
    app.set("layout", "layouts/main");
    app.use(morgan(formatoRegistro));
    app.use(identificarSolicitud);
    app.use(medirDuracion);
    app.use(expressLayouts);
    app.use(express.static(path.join(__dirname, "..", "public")));
    app.use(express.urlencoded({ extended: false }));
    app.use(express.json());

    app.get("/", (req, res) => {
        res.status(200).render("inicio", {
            titulo: "Consulta tus reservas",
        });
    });

    app.get("/estado", controladorReservas.verEstado);
    app.use("/api/reservas", crearRouterReservasApi(controladorReservas)); //Esto es para que se pueda acceder a la lista de reservas en formato JSON desde la ruta /api/reservas, y se le pasa el controlador de reservas que contiene las funciones listarApi, obtenerApi y crearApi.
    app.use("/reservas", reservasRouter); // /reservas es la ruta base para todas las rutas de reservas, y reservasRouter contiene crearRouterReservas que contiene las rutas para listar, mostrar formulario, mostrar detalle y crear reservas. Y se le pasa el controlador de reservas que contiene las funciones listar, mostrarFormulario, mostrarDetalle y crear.

    //Esto es para forzar un error 500 en la ruta /api/prueba-error, para probar el manejo de errores en la API sin desconectar la conexion a MongoDB. Esto es solo para fines de prueba 
    app.get("/api/prueba-error", (req, res, next) => {
        next(new Error("Fallo simulado"));
    });

    app.use((req, res) => {
        if (req.path.startsWith("/api/")) { //Si la ruta empieza con /api/, se devuelve un mensaje de error en formato JSON, ya que es una API y no una vista HTML.
            return res.status(404).json({ error: "Ruta no encontrada." });
        }
        res.status(404).render("no-encontrado", {
            //Mensaje 404 al final del pipeline
            codigo: 404,
            titulo: "Página no encontrada",
            mensaje: "La dirección solicitada no existe.",
        });
    });

    app.use(
        crearManejadorErrores({
            vistaFormulario: "reservas/nueva",
            tituloFormulario: "Nueva reserva",
        }),
    );
    return app;
}

module.exports = { crearApp }; //Esto se va a exportar a index.js

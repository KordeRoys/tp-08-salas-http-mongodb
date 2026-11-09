const { leerConfiguracion } = require("./config/entorno");
const {
    conectarBaseDatos, 
    desconectarBaseDatos,
} = require("./config/base-datos"); //TP8 Agregamos la conexion a la base de datos
//const { crearServicioReservas } = require("./servicios/reservas"); //TP8 Ya no se requiere
const { crearServicioReservasMongo } = require("./servicios/reservas-mongo"); //Antes se trabajaba con servicio/productos que trabajaba con la memoria, ahora con productos de mongo
const { crearApp } = require("./app");

//const reservas = [] Se borra

async function main() {
    const { puerto, formatoRegistro } = leerConfiguracion(); //* configuracion.js
    //const servicioReservas = crearServicioReservas(reservas); // *servicios/reservas ahora es reemplazada por servicioReservasMongo que es el que se conecta a la base de datos
    await conectarBaseDatos();
    const servicioReservas = crearServicioReservasMongo();
    const app = crearApp({ servicioReservas, formatoRegistro });
    const servidor = app.listen(puerto, () => {
        console.log(`Aplicación disponible en http://localhost:${puerto}`);
    });
    let cerrando = false;
    function cerrar() {
        if (cerrando) return; //Si ya se esta cerrando, no hace nada. Esto evita que se ejecute varias veces la funcion cerrar y se intente cerrar la conexion a la base de datos varias veces.
        cerrando = true;//Si no se esta cerrando, se pone en true para que no se vuelva a ejecutar la funcion cerrar.
        servidor.close(async () => {
            try {
                await desconectarBaseDatos();
            } catch (error) {
                console.error("Error al cerrar:", error.name);
                process.exitCode = 1;
            }
        });
    }
    process.once("SIGINT", cerrar); //process.once() es un método que permite registrar un manejador de eventos para un evento específico. En este caso, se está registrando el manejador cerrar para el evento SIGINT, que se genera cuando se presiona Ctrl+C en la terminal. Esto permite que la aplicación cierre correctamente la conexión a la base de datos y libere los recursos antes de finalizar.
    process.once("SIGTERM", cerrar);
    servidor.on("error", (error) => {
        console.error("No se pudo escuchar el puerto:", error.code);
        process.exitCode = 1;
        desconectarBaseDatos().catch((fallo) => {
            console.error("Error al cerrar:", fallo.name);
        });
    });
}
main().catch(async (error) => {
    console.error("No se pudo iniciar la aplicación:", error.name);
    console.error("Revisar entorno, DNS, red, acceso de Atlas y puerto."); //CLASE 8 Aqui tambine cambia el mensaje
    process.exitCode = 1;
    try {
        await desconectarBaseDatos(); //CLASE 8 y desconecta siempre al final
    } catch (fallo) {
        console.error("Error al cerrar:", fallo.name);
    }
}); 
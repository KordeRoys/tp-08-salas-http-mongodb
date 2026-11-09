//# solicitud y respuesta HTTP
//El controlador se encarga de recibir las solicitudes del cliente, procesarlas y devolver una respuesta. Para ello, utiliza los servicios de reservas, que contienen la lógica de negocio de la aplicación. El controlador no debe contener lógica de negocio, sino que debe delegar esa responsabilidad a los servicios. Esto permite separar las responsabilidades y mantener el código más limpio y mantenible.

function crearControladorReservas(servicioReservas) {
  //el parametro servicioReservas es el que se va a inyectar desde app.js, y es el que contiene la logica de negocio de las reservas
  async function listar(req, res) {
    const reservas = await servicioReservas.listar();
    res.status(200).render("reservas/lista", {
      titulo: "Reservas",
      reservas, //Se recibe el servicioReservas y se le aplica la funcion listar, obtenerPorId, crear, etc
    });
  }
  function mostrarFormulario(req, res) {
    res.status(200).render("reservas/nueva", {
      titulo: "AGREGUE UNA NUEVA RESERVA",
      error: null,
      valores: {}, //En este caso no estamos utilizando nada
    });
  } 
  async function mostrarDetalle(req, res) {
    const reserva = await servicioReservas.obtenerPorId(req.params.id);
    if (!reserva) {
      return res.status(404).render("no-encontrado", {
        codigo: 404,
        titulo: "No se encontro reserva",
        mensaje: "No existe reserva con ese identificador.",
      });
    }
    res.status(200).render("reservas/detalle", {
      titulo: reserva.estudiante,
      reserva,
    });
  }
  async function crear(req, res) {
    await servicioReservas.crear(req.reservaValidada);
    res.redirect("/reservas");
  }
  async function verEstado(req, res) {
    const reservas = await servicioReservas.listar();
    res.status(200).json({
      servicio: "activo",
      reservas: reservas.length, //Esto muestra la cantidad de reservas guardadas en el array
      //le agregaremos codigos de reservas para ver los en /estado
      codigosReservas: reservas.map((reserva) => `BIB-${String(reserva.id).padStart(4, "0")}`), //padStart(4, "0") sirve para que el id de la reserva tenga 4 digitos, agregando ceros a la izquierda si es necesario. Ej: BIB-0001, BIB-0002, BIB-0003
      solicitudId: res.locals.solicitudId, //Esta linea mmuestra la cantidad de solicitudes hechas y se suma en 1 por cada actualizacion
    });

  }
  //NUEVO
  async function listarApi(req, res) { 
    const reservas = await servicioReservas.listar(req.query.sala); //IMPORTANTE ENTENDER* Las funciones listar, crear, obtenerPorId  de controladores/reservas va a ser usadas en servicios/reservas-mongo.js, que es el que se encarga de manejar la logica de negocio de las reservas, y va a ser inyectado en app.js para que pueda ser usado en las rutas de reservas. req.query.sala es un parametro opcional que se puede pasar en la url para filtrar las reservas por sala. Ej: /api/reservas?sala=Aula%201
    res.json(reservas); 
  }
  async function obtenerApi(req, res) {
    const reserva = await servicioReservas.obtenerPorId(req.params.id);
    if (!reserva) { //!Si no existe la reserva con el id especificado, se devuelve un error 404 con un mensaje de error en formato JSON.
      return res.status(404).json({
        error: "No existe reserva con ese identificador.",
      });
    }
    res.json(reserva);
  }
  async function crearApi(req, res) {
    const reserva = await servicioReservas.crear(req.reservaValidada); //reservaValidada es el objeto que viene del middleware de validacion, y contiene los datos de la reserva validados y transformados. El servicio de reservas se encarga de guardar la reserva en la base de datos y devolver el objeto de la reserva creada.
    res
      .location(`/api/reservas/${reserva.id}`)//Esto es para que el cliente sepa donde se encuentra la nueva reserva creada, y pueda acceder a ella. Esto es una buena practica de REST, ya que el cliente puede acceder a la nueva reserva creada sin tener que hacer otra solicitud.
      .status(201)
      .json(reserva);
  }
  return {
    listar,
    mostrarFormulario,
    mostrarDetalle,
    crear,
    listarApi, //*NUEVO
    obtenerApi,//*NUEVO
    crearApi,//*NUEVO
    verEstado,
  };
}
module.exports = { crearControladorReservas }; //esto se exporta a app.js con el parametro servicioReservas que contiene la logica de negocio de las reservas, y es el que se va a inyectar en el controlador para que pueda manejar las rutas de reservas.

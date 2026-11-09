//Esto se exporta a /rutas/reservas

//CLASE 8
function prepararAreaReservas(req, res, next) {
  //Esta funcion sirve setear la variable res.locals.seccion con el valor "Solicita reserva", que luego se va a usar en la vista para mostrar el titulo de la pagina.
  res.locals.seccion = "Solicita reserva"; //res.locals es un objeto que se puede usar para guardar variables que se van a usar en cualquier parte del codigo, ya que se guarda en el objeto res.locals. Y .seccion es una propiedad que se va a usar en la vista para mostrar el titulo de la pagina en listas.ejs
  console.log("Seccion: " + res.locals.seccion); //Este console.log sirve para mostrar en la consola el valor de la variable res.locals.seccion, para verificar que se esta seteando correctamente. Y se va a mostrar en la consola del servidor, no en la del navegador.
  next();
}

function validarDatosReserva(req, res, next) {
  const valores = req.body ?? {}; //si el cuerpo viene nulo o undefined vamos a usar un objeto vacio para poder validar
  const estudiante =
    typeof valores.estudiante === "string" ? valores.estudiante.trim() : "";
  const email =
    typeof valores.email === "string" ? valores.email.trim() : "";
  const sala =
    typeof valores.sala === "string" ? valores.sala.trim() : "";
  const fecha = 
    typeof valores.fecha === "string" ? valores.fecha.trim() : ""; 
  const turno =
    typeof valores.turno === "string" ? valores.turno.trim() : "";
  const personas = Number(valores.personas);
  //Estas son validaciones del ingreso de datos del formulario
  const salasValidas = ["Sala Norte", "Sala Sur", "Sala Multimedia"]; //Estas son validaciones para que el usuario no pueda enviar valores que no esten en la lista de salas validas. Por ejemplo, alguien podria enviar sala=Sala Inventada manualmente. salasValidas.includes(sala) permite rechazarlo. Lo mismo ocurre con el turno.
  const turnosValidos = ["Mañana", "Tarde", "Noche"];

  if (
    !estudiante ||
    !email ||
    !email.includes("@") ||
    !salasValidas.includes(sala) ||
    !fecha ||
    !turnosValidos.includes(turno) ||
    !Number.isInteger(personas) ||
    personas < 1 ||
    personas > 6
  ) {
    if (req.baseUrl === "/api/reservas") { //req.baseUrl es una propiedad de la solicitud que contiene la ruta base de la URL. En este caso, estamos comprobando si la ruta base es /api/reservas. Si es así, entonces devolvemos un error en formato JSON. Si no es así, entonces devolvemos un error en formato HTML.
      return res.status(400).json({
        error: "revisa los cambios y elija entre 1 y 6 lugares.",
      });
    }
    return res.status(400).render("reservas/nueva", {
      //400 significa que la solicitud es incorrecta, y se va a renderizar la vista reservas/nueva.ejs con los valores que el usuario ingreso en el formulario, para que pueda corregirlos. Y se va a mostrar un mensaje de error.
      titulo: "AGREGUE UNA NUEVA RESERVA",
      error: "revisa los cambios y elija entre 1 y 6 lugares.", //este error no se deberia mostrar ya que el formulario lleva un option de 1 a 6 y no es posible que el usuario ingrese un valor fuera de ese rango, pero se deja por si acaso. Y este error se va a mostrar en la vista reservas/nueva.ejs
      valores: req.body, //En esta linea, valores: vienen del formulario nueva.ejs y se va a encargar de devolver y mostrar los valores que el usuario ingreso en el formulario
    });
  }
  req.reservaValidada = { estudiante, email, sala, fecha, turno, personas }; // Esta linea sirve para GUARDAR los datos validados en el objeto req, para que luego se puedan usar en la funcion crearInscripciones
  next(); //En el caso de que no haya casos invalidos continuamos el flujo con next
}
module.exports = { validarDatosReserva, prepararAreaReservas }; //Estas funciones se exportan a rutas/reservas para ser usados en el router de reservas.
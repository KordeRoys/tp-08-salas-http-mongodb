//# identificación y medición

let numeroDeSolicitud = 0; //iniciamos esta variable let en 0

function identificarSolicitud(req, res, next) {
  numeroDeSolicitud += 1;
  const bib = `BIB-${String(numeroDeSolicitud).padStart(4, "0")}`;
  res.locals.solicitudId = `CAM- Cantidad de solicitudes:${String(numeroDeSolicitud)}`; //locals.solicitudId es una variable que se va a poder usar en cualquier parte del codigo, ya que se guarda en el objeto res.locals. CAM
  console.log(
    `identificarSolicitud : [${res.locals.solicitudId}] [${bib}] ${req.method} ${req.originalUrl}`,
  ); //locals es un objeto que se puede usar para guardar variables que se van a usar en cualquier parte del codigo, ya que se guarda en el objeto res.locals
  next(); //locals. va a crear una variable "solicitudId" temporal que se guarda en el codigo, para luego usarla donde queramos
}

function medirDuracion(req, res, next) {
  const inicio = process.hrtime.bigint();
  res.on("finish", () => {
    const fin = process.hrtime.bigint();
    const milisegundos = Number(fin - inicio) / 1_000_000;
    console.log(
      `[${res.locals.solicitudId}] ${req.method} ${req.originalUrl} ` +
        `${res.statusCode} ${milisegundos.toFixed(2)} ms`,
    ); //Esto va a calcular la diferencia de horario entre la hora de fin y la hora de inicio
  });
  next();
}

module.exports = { identificarSolicitud, medirDuracion };

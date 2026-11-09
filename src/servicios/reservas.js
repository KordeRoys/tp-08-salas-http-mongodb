//Esto se exporta a index.js, donde se importa y se utiliza para crear el servicio de reservas.

function crearServicioReservas(datosIniciales) {
  //datosIniciales es un array de objetos que contiene las reservas iniciales. Este array se pasa como parametro a la funcion crearServicioReservas, que devuelve un objeto con tres metodos: listar, obtenerPorId y crear. Estos metodos son los que se utilizan en los controladores para manejar las reservas.
  const reservas = [...datosIniciales]; //... los tres puntos sirven para hacer una copia del array, para que no se modifique el array original. Esto es importante porque si se modifica el array original, se pierden los datos iniciales. Y si se hace una copia, se puede modificar la copia sin afectar al array original. Esto es importante porque si se modifica el array original, se pierden los datos iniciales. Y si se hace una copia, se puede modificar la copia sin afectar al array original.

  function listar() {
    return [...reservas];
  }
 
  function obtenerPorId(id) {
    return reservas.find((reserva) => reserva.id === id) ?? null; //Lo que antes estaba en index.js ahora pasa al servicio
  }

  function crear(datosValidados) {
    const ultimoId = reservas.reduce(
      (mayor, reserva) => Math.max(mayor, reserva.id),
      0,
    );
    const nuevo = { id: ultimoId + 1, ...datosValidados };
    reservas.push(nuevo);
    return nuevo;
  }
  return { listar, obtenerPorId, crear };
}

module.exports = { crearServicioReservas }; //Esto se exporta a index.js, donde se importa y se utiliza para crear el servicio de reservas.

//Este archivo servia para trabajar en la ejecucion de forma local
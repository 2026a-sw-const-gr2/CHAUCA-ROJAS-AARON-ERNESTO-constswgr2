const Smartphone = require('../models/smartphoneModel');

// Mantenimiento perfectivo: la capa de servicio separa la logica de negocio
// para poder agregar busqueda, filtros o SQLite sin tocar las rutas.
let smartphones = [];
let nextId = 1;

function create(data) {
  const validation = Smartphone.validate(data);
  if (!validation.isValid) {
    throw createHttpError(400, validation.message);
  }

  const smartphone = Smartphone.create({
    id: nextId,
    ...data,
  });

  smartphones.push(smartphone);
  nextId += 1;

  return smartphone;
}

function findAll() {
  return smartphones;
}

function findById(id) {
  const smartphone = smartphones.find((item) => item.id === Number(id));

  if (!smartphone) {
    throw createHttpError(404, 'Smartphone no encontrado');
  }

  return smartphone;
}

function update(id, data) {
  const currentSmartphone = findById(id);
  const updatedData = {
    ...currentSmartphone,
    ...data,
    id: currentSmartphone.id,
  };

  const validation = Smartphone.validate(updatedData);
  if (!validation.isValid) {
    throw createHttpError(400, validation.message);
  }

  const updatedSmartphone = Smartphone.create(updatedData);
  smartphones = smartphones.map((item) =>
    item.id === updatedSmartphone.id ? updatedSmartphone : item
  );

  return updatedSmartphone;
}

function remove(id) {
  const smartphone = findById(id);
  smartphones = smartphones.filter((item) => item.id !== smartphone.id);
  return smartphone;
}

function createHttpError(statusCode, message) {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
}

module.exports = {
  create,
  findAll,
  findById,
  update,
  remove,
};

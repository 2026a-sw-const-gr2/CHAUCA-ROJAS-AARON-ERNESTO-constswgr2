const smartphoneService = require('../services/smartphoneService');
const eventService = require('../services/eventService');

async function createSmartphone(req, res) {
  try {
    const smartphone = smartphoneService.create(req.body);

    await eventService.sendSmartphoneEvent({
      action: 'CREATE',
      title: 'Smartphone creado',
      description: 'Se registro un nuevo smartphone',
      payload: smartphone,
    });

    res.status(201).json(smartphone);
  } catch (error) {
    handleControllerError(res, error);
  }
}

async function listSmartphones(req, res) {
  try {
    const smartphones = smartphoneService.findAll();

    await eventService.sendSmartphoneEvent({
      action: 'QUERY',
      title: 'Smartphones consultados',
      description: 'Se consulto el catalogo de smartphones',
      payload: { total: smartphones.length },
    });

    res.json(smartphones);
  } catch (error) {
    handleControllerError(res, error);
  }
}

async function getSmartphoneById(req, res) {
  try {
    const smartphone = smartphoneService.findById(req.params.id);

    await eventService.sendSmartphoneEvent({
      action: 'QUERY',
      title: 'Smartphone consultado',
      description: 'Se consulto un smartphone por id',
      payload: smartphone,
    });

    res.json(smartphone);
  } catch (error) {
    handleControllerError(res, error);
  }
}

async function updateSmartphone(req, res) {
  try {
    const smartphone = smartphoneService.update(req.params.id, req.body);

    await eventService.sendSmartphoneEvent({
      action: 'UPDATE',
      title: 'Smartphone actualizado',
      description: 'Se actualizo la informacion de un smartphone',
      payload: smartphone,
    });

    res.json(smartphone);
  } catch (error) {
    handleControllerError(res, error);
  }
}

async function deleteSmartphone(req, res) {
  try {
    const smartphone = smartphoneService.remove(req.params.id);

    await eventService.sendSmartphoneEvent({
      action: 'DELETE',
      title: 'Smartphone eliminado',
      description: 'Se elimino un smartphone del catalogo',
      payload: smartphone,
    });

    res.json({
      message: 'Smartphone eliminado correctamente',
      smartphone,
    });
  } catch (error) {
    handleControllerError(res, error);
  }
}

function handleControllerError(res, error) {
  if (error.statusCode) {
    return res.status(error.statusCode).json({ message: error.message });
  }

  console.error('Error en controlador:', error.message);
  return res.status(500).json({ message: 'Error interno del servidor' });
}

module.exports = {
  createSmartphone,
  listSmartphones,
  getSmartphoneById,
  updateSmartphone,
  deleteSmartphone,
};

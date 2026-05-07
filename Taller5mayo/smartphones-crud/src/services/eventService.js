const axios = require('axios');

const EVENT_MANAGER_URL =
  process.env.EVENT_MANAGER_URL || 'http://localhost:3000/events';

async function sendSmartphoneEvent({ action, title, description, payload }) {
  const event = {
    source: 'smartphones-crud',
    entity: 'smartphone',
    action,
    title,
    description,
    payload,
  };

  try {
    await axios.post(EVENT_MANAGER_URL, event);
  } catch (error) {
    // Mantenimiento adaptativo: si el Event Manager cambia de URL, se ajusta
    // EVENT_MANAGER_URL sin modificar los controladores del CRUD.
    console.error('No se pudo enviar el evento al Event Manager:', error.message);
  }
}

module.exports = {
  sendSmartphoneEvent,
};

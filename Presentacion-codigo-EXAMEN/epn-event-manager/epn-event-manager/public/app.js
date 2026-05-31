const apiUrl = '/api/smartphones';
const API_KEY = 'epn-fis-2026-secret-key';

const form = document.querySelector('#smartphoneForm');
const formTitle = document.querySelector('#formTitle');
const message = document.querySelector('#message');
const table = document.querySelector('#smartphonesTable');
const reloadButton = document.querySelector('#reloadButton');
const cancelButton = document.querySelector('#cancelButton');

const fields = {
  id: document.querySelector('#smartphoneId'),
  brand: document.querySelector('#brand'),
  model: document.querySelector('#model'),
  price: document.querySelector('#price'),
  storage: document.querySelector('#storage'),
};

function showMessage(text, type = 'ok') {
  message.textContent = text;
  message.className = `message ${type}`;
  message.hidden = false;
}

function clearMessage() {
  message.hidden = true;
}

function resetForm() {
  form.reset();
  fields.id.value = '';
  formTitle.textContent = 'Crear smartphone';
  cancelButton.hidden = true;
}

async function requestJson(url, options = {}) {
  const response = await fetch(url, {
    headers: { 'Content-Type': 'application/json', 'x-fis-epn-key': API_KEY },
    ...options,
  });
  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || 'No se pudo completar la operacion');
  }

  return data;
}

async function loadSmartphones() {
  const smartphones = await requestJson(apiUrl);
  table.innerHTML = '';

  if (smartphones.length === 0) {
    table.innerHTML =
      '<tr><td colspan="6">Todavia no hay smartphones registrados.</td></tr>';
    return;
  }

  for (const phone of smartphones) {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${phone.id}</td>
      <td>${phone.brand}</td>
      <td>${phone.model}</td>
      <td>$${Number(phone.price).toFixed(2)}</td>
      <td>${phone.storage}</td>
      <td>
        <button type="button" data-action="edit">Editar</button>
        <button type="button" class="danger" data-action="delete">Eliminar</button>
      </td>
    `;
    row.querySelector('[data-action="edit"]').addEventListener('click', () => {
      fields.id.value = phone.id;
      fields.brand.value = phone.brand;
      fields.model.value = phone.model;
      fields.price.value = phone.price;
      fields.storage.value = phone.storage;
      formTitle.textContent = `Editar smartphone #${phone.id}`;
      cancelButton.hidden = false;
      clearMessage();
    });
    row
      .querySelector('[data-action="delete"]')
      .addEventListener('click', () => deleteSmartphone(phone.id));
    table.appendChild(row);
  }
}

async function saveSmartphone(event) {
  event.preventDefault();
  clearMessage();

  const id = fields.id.value;
  const payload = {
    brand: fields.brand.value,
    model: fields.model.value,
    price: Number(fields.price.value),
    storage: fields.storage.value,
  };

  try {
    await requestJson(id ? `${apiUrl}/${id}` : apiUrl, {
      method: id ? 'PUT' : 'POST',
      body: JSON.stringify(payload),
    });
    showMessage(id ? 'Smartphone actualizado.' : 'Smartphone creado.');
    resetForm();
    await loadSmartphones();
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

async function deleteSmartphone(id) {
  clearMessage();
  try {
    await requestJson(`${apiUrl}/${id}`, { method: 'DELETE' });
    showMessage('Smartphone eliminado.');
    await loadSmartphones();
  } catch (error) {
    showMessage(error.message, 'error');
  }
}

form.addEventListener('submit', saveSmartphone);
reloadButton.addEventListener('click', loadSmartphones);
cancelButton.addEventListener('click', () => {
  resetForm();
  clearMessage();
});

loadSmartphones().catch((error) => showMessage(error.message, 'error'));

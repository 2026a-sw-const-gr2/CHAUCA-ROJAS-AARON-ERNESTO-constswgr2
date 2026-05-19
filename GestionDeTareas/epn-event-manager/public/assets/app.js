const form = document.getElementById('taskForm');
const message = document.getElementById('message');
const tasksBody = document.getElementById('tasksBody');

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const id = document.getElementById('taskId').value;
  const data = {
    titulo: document.getElementById('titulo').value,
    descripcion: document.getElementById('descripcion').value,
    estado: document.getElementById('estado').value,
  };
  const url = id ? '/tasks/' + id : '/tasks';
  const method = id ? 'PUT' : 'POST';

  try {
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    clearForm();
    showMessage('Tarea guardada', 'success');
    loadTasks();
  } catch (error) {
    showMessage('Error al guardar tarea: ' + error.message, 'error');
  }
});

async function loadTasks() {
  try {
    const response = await fetch('/tasks');
    const tasks = await response.json();
    tasksBody.innerHTML = '';

    tasks.forEach((task) => {
      const row = document.createElement('tr');
      row.innerHTML =
        '<td>' +
        task.id +
        '</td>' +
        '<td>' +
        escapeHtml(task.titulo) +
        '</td>' +
        '<td>' +
        escapeHtml(task.descripcion || '') +
        '</td>' +
        '<td>' +
        escapeHtml(task.estado) +
        '</td>' +
        '<td>' +
        escapeHtml(task.fecha_creacion) +
        '</td>' +
        '<td class="actions">' +
        '<button type="button" onclick="editTask(' +
        task.id +
        ')">Editar</button>' +
        '<button type="button" onclick="deleteTask(' +
        task.id +
        ')">Eliminar</button>' +
        '</td>';
      row.dataset.task = JSON.stringify(task);
      tasksBody.appendChild(row);
    });
  } catch (error) {
    showMessage('Error al cargar tareas: ' + error.message, 'error');
  }
}

function editTask(id) {
  const row = Array.from(tasksBody.children).find((item) => {
    return JSON.parse(item.dataset.task).id === id;
  });
  const task = JSON.parse(row.dataset.task);
  document.getElementById('taskId').value = task.id;
  document.getElementById('titulo').value = task.titulo;
  document.getElementById('descripcion').value = task.descripcion || '';
  document.getElementById('estado').value = task.estado;
}

async function deleteTask(id) {
  try {
    await fetch('/tasks/' + id, { method: 'DELETE' });
    showMessage('Tarea eliminada', 'success');
    loadTasks();
  } catch (error) {
    showMessage('Error al eliminar tarea: ' + error.message, 'error');
  }
}

function clearForm() {
  document.getElementById('taskForm').reset();
  document.getElementById('taskId').value = '';
}

function showMessage(text, type = 'info') {
  message.textContent = text;
  message.className = 'message ' + type;
  setTimeout(() => {
    message.textContent = '';
    message.className = 'message';
  }, 3000);
}

function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

// Carga las tareas al iniciar
loadTasks();

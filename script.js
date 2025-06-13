// Capturamos los elementos del DOM
const taskForm = document.getElementById('task-form');
const taskNameInput = document.getElementById('task-name');
const taskDescriptionInput = document.getElementById('task-desc');
const taskList = document.getElementById('task-list');
const taskIdInput = document.getElementById('task-id');
const taskCount = document.getElementById('task-count');

// Recuperamos tareas almacenadas en localStorage
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Función que renderiza las tareas en pantalla
function renderTasks() {
  taskList.innerHTML = '';
  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = 'task-item';
    li.setAttribute('data-id', task.id);

    const title = document.createElement('h3');
    title.textContent = task.name;
    title.addEventListener('click', () => toggleDescription(task.id));
    li.appendChild(title);

    const description = document.createElement('div');
    description.className = 'task-description';
    description.textContent = task.description;
    li.appendChild(description);

    const actions = document.createElement('div');
    actions.className = 'task-actions';

    const editBtn = document.createElement('button');
    editBtn.innerHTML = '<i class="fas fa-edit"></i> Editar';
    editBtn.className = 'edit';
    editBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      editTask(task.id);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i> Eliminar';
    deleteBtn.className = 'delete';
    deleteBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      deleteTask(task.id);
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    li.appendChild(actions);

    taskList.appendChild(li);
  });

  taskCount.textContent = `Tareas: ${tasks.length}`;
}

// Muestra u oculta la descripción de la tarea
function toggleDescription(id) {
  const taskItem = document.querySelector(`[data-id="${id}"]`);
  const description = taskItem.querySelector('.task-description');
  description.classList.toggle('active');
}

// Cargar los datos de una tarea al formulario para editar
function editTask(id) {
  const task = tasks.find(t => t.id === id);
  taskIdInput.value = task.id;
  taskNameInput.value = task.name;
  taskDescriptionInput.value = task.description;
}

// Eliminar tarea
function deleteTask(id) {
  if (confirm('¿Deseas eliminar la tarea?')) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
    renderTasks();
  }
}

// Guardar las tareas en el localStorage
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Manejo del envío del formulario
taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = taskNameInput.value.trim();
  const description = taskDescriptionInput.value.trim();
  const id = taskIdInput.value;

  // Validaciones
  if (!name) {
    alert('Por favor, ingresa el nombre de la tarea.');
    return;
  }

  if (!description) {
    alert('Por favor, ingresa la descripción.');
    return;
  }

  if (id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index].name = name;
      tasks[index].description = description;
    }
  } else {
    tasks.push({ id: Date.now().toString(), name, description });
  }

  saveTasks();
  renderTasks();
  taskForm.reset();
  taskIdInput.value = '';
});

// Mostrar las tareas al cargar
renderTasks();

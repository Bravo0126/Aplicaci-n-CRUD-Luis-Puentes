const taskForm = document.getElementById('task-form');
const taskNameInput = document.getElementById('task-name');
const taskDescriptionInput = document.getElementById('task-desc');
const taskList = document.getElementById('task-list');
const taskIdInput = document.getElementById('task-id');
const taskCount = document.getElementById('task-count');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

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

function toggleDescription(id) {
  const taskItem = document.querySelector(`li[data-id="${id}"]`);
  const descriptionDiv = taskItem.querySelector('.task-description');

  document.querySelectorAll('.task-description').forEach(desc => {
    if (desc !== descriptionDiv) {
      desc.classList.remove('active');
    }
  });

  descriptionDiv.classList.toggle('active');
}

function editTask(id) {
  const task = tasks.find(t => t.id === id);
  if (task) {
    taskIdInput.value = task.id;
    taskNameInput.value = task.name;
    taskDescriptionInput.value = task.description;
    taskNameInput.focus();
  }
}

function deleteTask(id) {
  const confirmDelete = confirm('¿Estás seguro de que deseas eliminar esta tarea?');
  if (!confirmDelete) return;

  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

taskForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const name = taskNameInput.value.trim();
  const desc = taskDescriptionInput.value.trim();
  const id = taskIdInput.value;

  if (!name && !desc) {
    alert('Por favor, completa el nombre y la descripción de la tarea.');
    return;
  }

  if (!name) {
    alert('Por favor, ingresa el nombre de la tarea.');
    return;
  }

  if (!desc) {
    alert('Por favor, ingresa la descripción de la tarea.');
    return;
  }

  if (id) {
    const index = tasks.findIndex(t => t.id === id);
    if (index !== -1) {
      tasks[index].name = name;
      tasks[index].description = desc;
    }
  } else {
    tasks.push({ id: Date.now().toString(), name, description: desc });
  }

  saveTasks();
  renderTasks();
  taskForm.reset();
});

document.addEventListener('click', function (e) {
  const clickedInside = e.target.closest('.task-item');
  if (!clickedInside) {
    document.querySelectorAll('.task-description').forEach(desc => {
      desc.classList.remove('active');
    });
  }
});

renderTasks();

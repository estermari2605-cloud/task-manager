/* ==========================================================
   Task Manager — lógica da aplicação
   Funcionalidades: criar, editar, excluir, concluir e filtrar
   tarefas, com persistência no localStorage.
   ========================================================== */

(() => {
  'use strict';

  const STORAGE_KEY = 'task-manager:tasks';

  const PRIORITY_LABELS = { low: 'Baixa', medium: 'Média', high: 'Alta' };
  const PRIORITY_ORDER = { high: 0, medium: 1, low: 2 };

  const EMPTY_MESSAGES = {
    all: 'Nenhuma tarefa por aqui ainda. Adicione a primeira no formulário.',
    pending: 'Nenhuma tarefa pendente. Bom trabalho!',
    done: 'Nenhuma tarefa concluída ainda.',
  };

  /* ---------- Referências do DOM ---------- */

  const form = document.getElementById('task-form');
  const titleInput = document.getElementById('task-title');
  const priorityInput = document.getElementById('task-priority');
  const dueInput = document.getElementById('task-due');
  const formError = document.getElementById('form-error');
  const formTitle = document.getElementById('form-title');
  const formPanel = form.closest('.panel');
  const submitBtn = document.getElementById('submit-btn');
  const cancelBtn = document.getElementById('cancel-btn');
  const taskList = document.getElementById('task-list');
  const emptyState = document.getElementById('empty-state');
  const summary = document.getElementById('summary');
  const clearDoneBtn = document.getElementById('clear-done-btn');
  const filterButtons = document.querySelectorAll('.filter');

  /* ---------- Estado ---------- */

  let tasks = loadTasks();
  let currentFilter = 'all';
  let editingId = null;

  /* ---------- Persistência ---------- */

  function loadTasks() {
    try {
      const data = JSON.parse(localStorage.getItem(STORAGE_KEY));
      return Array.isArray(data) ? data : [];
    } catch (error) {
      return [];
    }
  }

  function saveTasks() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.warn('Não foi possível salvar as tarefas.', error);
    }
  }

  /* ---------- Utilitários ---------- */

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }

  function todayString() {
    const now = new Date();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    return `${now.getFullYear()}-${month}-${day}`;
  }

  function formatDate(isoDate) {
    const [year, month, day] = isoDate.split('-');
    return `${day}/${month}/${year}`;
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  /* ---------- Operações sobre tarefas ---------- */

  function addTask(title, priority, dueDate) {
    tasks.push({
      id: generateId(),
      title,
      priority,
      dueDate,
      done: false,
      createdAt: Date.now(),
    });
  }

  function updateTask(id, title, priority, dueDate) {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;
    task.title = title;
    task.priority = priority;
    task.dueDate = dueDate;
  }

  function toggleTask(id) {
    const task = tasks.find((item) => item.id === id);
    if (task) task.done = !task.done;
  }

  function deleteTask(id) {
    tasks = tasks.filter((item) => item.id !== id);
    if (editingId === id) stopEditing();
  }

  function clearCompleted() {
    tasks = tasks.filter((item) => !item.done);
    if (editingId && !tasks.some((item) => item.id === editingId)) stopEditing();
  }

  /* ---------- Edição ---------- */

  function startEditing(id) {
    const task = tasks.find((item) => item.id === id);
    if (!task) return;

    editingId = id;
    titleInput.value = task.title;
    priorityInput.value = task.priority;
    dueInput.value = task.dueDate || '';

    formTitle.textContent = 'Editar tarefa';
    submitBtn.textContent = 'Salvar alterações';
    cancelBtn.hidden = false;
    formPanel.classList.add('is-editing');
    clearError();
    titleInput.focus();
  }

  function stopEditing() {
    editingId = null;
    form.reset();
    priorityInput.value = 'medium';

    formTitle.textContent = 'Nova tarefa';
    submitBtn.textContent = 'Adicionar tarefa';
    cancelBtn.hidden = true;
    formPanel.classList.remove('is-editing');
    clearError();
  }

  /* ---------- Validação ---------- */

  function showError(message) {
    formError.textContent = message;
    formError.hidden = false;
    titleInput.classList.add('has-error');
    titleInput.setAttribute('aria-invalid', 'true');
  }

  function clearError() {
    formError.hidden = true;
    titleInput.classList.remove('has-error');
    titleInput.removeAttribute('aria-invalid');
  }

  /* ---------- Renderização ---------- */

  function getVisibleTasks() {
    const filtered = tasks.filter((task) => {
      if (currentFilter === 'pending') return !task.done;
      if (currentFilter === 'done') return task.done;
      return true;
    });

    // Pendentes primeiro; depois por prioridade; depois as mais recentes.
    return filtered.sort((a, b) => {
      if (a.done !== b.done) return a.done ? 1 : -1;
      if (a.priority !== b.priority) return PRIORITY_ORDER[a.priority] - PRIORITY_ORDER[b.priority];
      return b.createdAt - a.createdAt;
    });
  }

  function buildTaskItem(task) {
    const item = createElement('li', 'task');
    item.dataset.id = task.id;
    item.dataset.priority = task.priority;
    if (task.done) item.classList.add('is-done');

    const checkbox = createElement('input', 'task-check');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;
    checkbox.dataset.action = 'toggle';
    checkbox.setAttribute('aria-label', `Marcar "${task.title}" como ${task.done ? 'pendente' : 'concluída'}`);

    const body = createElement('div', 'task-body');
    body.append(createElement('p', 'task-title', task.title));

    const meta = createElement('div', 'task-meta');
    meta.append(createElement('span', '', `Prioridade ${PRIORITY_LABELS[task.priority].toLowerCase()}`));

    if (task.dueDate) {
      const overdue = !task.done && task.dueDate < todayString();
      const label = overdue ? `Venceu em ${formatDate(task.dueDate)}` : `Prazo: ${formatDate(task.dueDate)}`;
      meta.append(createElement('span', overdue ? 'overdue' : '', label));
    }
    body.append(meta);

    const actions = createElement('div', 'task-actions');
    const editBtn = createElement('button', 'icon-btn', 'Editar');
    editBtn.type = 'button';
    editBtn.dataset.action = 'edit';
    editBtn.setAttribute('aria-label', `Editar "${task.title}"`);

    const deleteBtn = createElement('button', 'icon-btn danger', 'Excluir');
    deleteBtn.type = 'button';
    deleteBtn.dataset.action = 'delete';
    deleteBtn.setAttribute('aria-label', `Excluir "${task.title}"`);

    actions.append(editBtn, deleteBtn);
    item.append(checkbox, body, actions);
    return item;
  }

  function renderList() {
    const visible = getVisibleTasks();
    taskList.replaceChildren(...visible.map(buildTaskItem));

    emptyState.hidden = visible.length > 0;
    emptyState.textContent = EMPTY_MESSAGES[currentFilter];
  }

  function renderCounters() {
    const total = tasks.length;
    const done = tasks.filter((task) => task.done).length;
    const pending = total - done;

    document.querySelector('[data-count="all"]').textContent = total;
    document.querySelector('[data-count="pending"]').textContent = pending;
    document.querySelector('[data-count="done"]').textContent = done;

    if (total === 0) {
      summary.textContent = 'Organize seu dia adicionando sua primeira tarefa.';
    } else if (pending === 0) {
      summary.textContent = 'Tudo concluído. Você zerou a lista!';
    } else {
      summary.textContent = `${pending} ${pending === 1 ? 'tarefa pendente' : 'tarefas pendentes'} de ${total}.`;
    }

    clearDoneBtn.disabled = done === 0;
    clearDoneBtn.style.opacity = done === 0 ? '0.5' : '1';
  }

  function render() {
    renderList();
    renderCounters();
    filterButtons.forEach((button) => {
      const active = button.dataset.filter === currentFilter;
      button.classList.toggle('is-active', active);
      button.setAttribute('aria-pressed', String(active));
    });
  }

  function commit() {
    saveTasks();
    render();
  }

  /* ---------- Eventos ---------- */

  form.addEventListener('submit', (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    if (!title) {
      showError('Digite o nome da tarefa antes de salvar.');
      titleInput.focus();
      return;
    }

    if (editingId) {
      updateTask(editingId, title, priorityInput.value, dueInput.value);
      stopEditing();
    } else {
      addTask(title, priorityInput.value, dueInput.value);
      form.reset();
      priorityInput.value = 'medium';
      clearError();
    }

    commit();
    titleInput.focus();
  });

  titleInput.addEventListener('input', clearError);
  cancelBtn.addEventListener('click', stopEditing);

  taskList.addEventListener('click', (event) => {
    const target = event.target.closest('[data-action]');
    if (!target) return;

    const id = target.closest('.task').dataset.id;
    const action = target.dataset.action;

    if (action === 'edit') {
      startEditing(id);
    } else if (action === 'delete') {
      if (window.confirm('Excluir esta tarefa? Essa ação não pode ser desfeita.')) {
        deleteTask(id);
        commit();
      }
    }
  });

  taskList.addEventListener('change', (event) => {
    if (event.target.dataset.action !== 'toggle') return;
    toggleTask(event.target.closest('.task').dataset.id);
    commit();
  });

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      currentFilter = button.dataset.filter;
      render();
    });
  });

  clearDoneBtn.addEventListener('click', () => {
    if (window.confirm('Remover todas as tarefas concluídas?')) {
      clearCompleted();
      commit();
    }
  });

  /* ---------- Início ---------- */

  render();
})();

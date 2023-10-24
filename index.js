class toDoList {
  constructor() {
    this.todos = [];
    this.loadTodos();
    this.drawTodos();
    this.searchTodos();
    this.searchMode = false;
    this.searchPhrase = '';
  }

  loadTodos() {
    this.todos = JSON.parse(localStorage.getItem('todos')) || [];
  }

  saveTodos(todos = this.todos) {
    localStorage.setItem('todos', JSON.stringify(todos));
  }

  drawTodos(todos = this.todos) {
    if (this.searchMode) {
      let filteredTodos = this.todos.filter((todo) => {
        return todo.title.includes(this.searchPhrase);
      });
      todos = filteredTodos;
    }

    let tasksParent = document.getElementById('tasks');
    while (tasksParent.hasChildNodes()) {
      tasksParent.removeChild(tasksParent.firstChild);
    }
    for (let i = 0; i < todos.length; i++) {
      let task = document.createElement('li');
      let taskDone = document.createElement('input');
      let taskTitle = document.createElement('p');
      let taskDate = document.createElement('p');
      let taskDelete = document.createElement('button');

      let taskEditTitle = document.createElement('input');
      let taskEditDate = document.createElement('input');
      let taskEditButton = document.createElement('button');

      const search = document.getElementById('search').value;

      taskTitle.classList.toggle('marked', todos[i].isDone);
      taskDate.classList.toggle('marked', todos[i].isDone);

      task.className = 'task';
      task.onclick = () => {
        taskTitle.classList.toggle('hidden');
        taskDate.classList.toggle('hidden');
        taskEditTitle.classList.toggle('hidden');
        taskEditDate.classList.toggle('hidden');
        taskEditButton.classList.toggle('hidden');
      };

      task.blur = () => {
        taskTitle.classList.remove('hidden');
        taskDate.classList.remove('hidden');
        taskEditTitle.classList.add('hidden');
        taskEditDate.classList.add('hidden');
        taskEditButton.classList.add('hidden');
      };

      taskDone.className = 'task-done';
      taskDone.type = 'checkbox';
      taskDone.checked = todos[i].isDone;
      taskDone.onclick = (e) => {
        e.stopPropagation();
        todos[i].isDone = !todos[i].isDone;
        this.saveTodos(todos);
        this.loadTodos();
        this.drawTodos(todos);
      };

      taskTitle.classList.add('task-title');
      taskTitle.innerHTML = todos[i].title;
      taskDate.classList.add('task-date');
      taskDate.innerHTML = todos[i].date || 'No date';
      taskDelete.classList.add('task-delete');
      taskDelete.innerHTML = 'Delete';
      taskDelete.onclick = (e) => {
        e.stopPropagation();
        let todosTemp = todos;
        todosTemp = this.todos.filter((todo) => {
          return todo.id != todos[i].id;
        });
        for (let i = 0; i < todosTemp.length; i++) {
          todosTemp[i].id = i + 1;
        }
        this.saveTodos(todosTemp);
        this.loadTodos();
        this.drawTodos(todosTemp);
      };

      // Edit
      taskEditTitle.type = 'text';
      taskEditTitle.classList.add('task-edit-title', 'hidden');
      taskEditTitle.value = taskTitle.innerHTML;
      taskEditTitle.onclick = (e) => {
        e.stopPropagation();
      };
      taskEditDate.type = 'date';
      taskEditDate.classList.add('task-edit-title', 'hidden');
      taskEditDate.value = taskDate.innerHTML;
      taskEditDate.min = getTomorrowDate();
      taskEditButton.innerHTML = 'Save';
      taskEditButton.classList.add('task-edit-button', 'hidden');
      taskEditButton.onclick = (e) => {
        e.stopPropagation();
        todos[i].date = taskEditDate.value;
        todos[i].title = taskEditTitle.value;
        this.saveTodos(todos);
        this.loadTodos();
        this.drawTodos(todos);
      };
      taskEditDate.onclick = (e) => {
        e.stopPropagation();
      };

      if (search.length > 1) {
        const title = taskTitle.textContent;
        const searchTerm = new RegExp(search, 'g'); // 'gi' for global and case-insensitive search
        const highlightedTitle = title.replace(
          searchTerm,
          (match) => `<span class="highlight">${match}</span>`
        );
        taskTitle.innerHTML = highlightedTitle;
      }

      task.appendChild(taskDone);
      task.appendChild(taskEditTitle);
      task.appendChild(taskTitle);
      task.appendChild(taskEditDate);
      task.appendChild(taskDate);
      task.appendChild(taskEditButton);
      task.appendChild(taskDelete);
      tasksParent.appendChild(task);
    }
  }

  searchTodos() {
    const search = document.getElementById('search');
    search.oninput = () => {
      this.searchPhrase = search.value;
      if (search.value.length > 1) {
        this.searchMode = true;
        this.drawTodos();
      } else {
        this.searchMode = false;
        this.drawTodos();
      }
    };
  }

  addTodo() {
    let id = this.todos.length + 1;
    let title = document.getElementById('task-title').value;
    let date = document.getElementById('task-date').value;
    let isDone = false;

    if (title.length < 3) {
      alert('Title must be at least 3 characters long');
      return;
    }
    if (title.length > 255) {
      alert('Title must be less than 255 characters long');
      return;
    }

    let task = new Task(id, title, date, isDone);
    this.todos.push(task);
    this.saveTodos();
    this.loadTodos();
    this.drawTodos();
  }
}

class Task {
  constructor(id, title, date, isDone) {
    this.id = id;
    this.title = title;
    this.date = date;
    this.isDone = isDone;
  }
}

let toDo;
window.onload = () => {
  toDo = new toDoList();
  document.getElementById('task-date').min = getTomorrowDate();
};

function addTask() {
  toDo.addTodo();
}

function searchTodos() {
  toDo.searchTodos();
}

function getTomorrowDate() {
  const tomorrow = new Date();
  tomorrow.setDate(new Date().getDate() + 1);
  return tomorrow.toISOString().split('T')[0];
}

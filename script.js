// Select DOM elements
const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const list = document.getElementById('todo-list');

// Load saved Quanta todos from localStorage (if any)
const STORAGE_KEY = 'quanta-todos';
let todos = [];
try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const parsed = saved ? JSON.parse(saved) : [];
    todos = Array.isArray(parsed) ? parsed : [];
} catch (error) {
    todos = [];
}

function saveTodos() {
    // Save current todos array to localStorage
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    } catch (error) {
        // Storage unavailable: the app still works for this session
    }
}

// Create a DOM node for a todo object
function createTodoNode(todo, index) {
    const li = document.createElement('li');

    // Text of the todo
    const textSpan = document.createElement('span');
    textSpan.textContent = todo.text;
    textSpan.style.margin = '0 8px';
    textSpan.style.textDecoration = todo.completed ? 'line-through' : '';

    // Checkbox to toggle completion
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = !!todo.completed;
    checkbox.addEventListener('change', () => {
        todo.completed = checkbox.checked;
        // Visual feedback: strike-through when completed
        textSpan.style.textDecoration = todo.completed ? 'line-through' : '';
        saveTodos();
    });

    // Double-click to edit the todo
    textSpan.addEventListener('dblclick', () => {
        const newText = prompt('Edit todo', todo.text);
        if (newText === null) {
            return;
        }
        const trimmed = newText.trim();
        if (!trimmed) {
            // Empty text removes the todo
            todos.splice(index, 1);
            render();
        } else {
            todo.text = trimmed;
            textSpan.textContent = trimmed;
        }
        saveTodos();
    });

    // Delete todo button
    const delBtn = document.createElement('button');
    delBtn.textContent = 'Delete';
    delBtn.addEventListener('click', () => {
        todos.splice(index, 1);
        render();
        saveTodos();
    });

    li.appendChild(checkbox);
    li.appendChild(textSpan);
    li.appendChild(delBtn);
    return li;
}

// Render the whole todo list from the todos array
function render() {
    list.innerHTML = '';
    todos.forEach((todo, index) => {
        list.appendChild(createTodoNode(todo, index));
    });
}

function addTodo() {
    const text = input.value.trim();
    if (!text) {
        return;
    }

    // Push a new todo object
    todos.push({ text: text, completed: false });
    input.value = '';
    render();
    saveTodos();
}

addBtn.addEventListener('click', addTodo);
input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});
render();

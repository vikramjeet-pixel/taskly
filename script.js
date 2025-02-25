class TodoApp {
    constructor() {
        this.tasks = [];
        this.elements = {
            form: document.getElementById('todo-form'),
            input: document.getElementById('task-input'),
            priority: document.getElementById('priority'),
            taskList: document.getElementById('task-list'),
            themeSelect: document.getElementById('theme-select'),
            clearAll: document.getElementById('clear-all'),
            totalTasks: document.getElementById('total-tasks'),
            completedTasks: document.getElementById('completed-tasks')
        };

        this.init();
    }

    init() {
        this.loadState();
        this.bindEvents();
        this.updateStats();
    }

    bindEvents() {
        this.elements.form.addEventListener('submit', (e) => this.handleSubmit(e));
        this.elements.themeSelect.addEventListener('change', () => this.changeTheme());
        this.elements.clearAll.addEventListener('click', () => this.clearAll());
    }

    handleSubmit(e) {
        e.preventDefault();
        const text = this.elements.input.value.trim();
        const priority = this.elements.priority.value;

        if (!text) return;

        const task = {
            id: Date.now(),
            text,
            priority,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.tasks.push(task);
        this.renderTask(task);
        this.saveState();
        this.elements.input.value = '';
        this.updateStats();
    }

    renderTask(task) {
        const li = document.createElement('li');
        li.className = `task-item ${task.completed ? 'completed' : ''}`;
        li.dataset.id = task.id;
        
        li.innerHTML = `
            <span class="priority-indicator priority-${task.priority}"></span>
            <span class="task-text">${task.text}</span>
            <button class="toggle-btn">${task.completed ? 'Undo' : 'Done'}</button>
            <button class="delete-btn">Delete</button>
        `;

        li.querySelector('.toggle-btn').addEventListener('click', () => this.toggleTask(task.id));
        li.querySelector('.delete-btn').addEventListener('click', () => this.deleteTask(task.id));
        
        this.elements.taskList.appendChild(li);
    }

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            this.refreshTasks();
            this.saveState();
            this.updateStats();
        }
    }

    deleteTask(id) {
        this.tasks = this.tasks.filter(t => t.id !== id);
        this.refreshTasks();
        this.saveState();
        this.updateStats();
    }

    clearAll() {
        if (confirm('Are you sure you want to clear all tasks?')) {
            this.tasks = [];
            this.refreshTasks();
            this.saveState();
            this.updateStats();
        }
    }

    refreshTasks() {
        this.elements.taskList.innerHTML = '';
        this.tasks.sort((a, b) => {
            const priorityOrder = { high: 3, medium: 2, low: 1 };
            return priorityOrder[b.priority] - priorityOrder[a.priority];
        }).forEach(task => this.renderTask(task));
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        this.elements.totalTasks.textContent = total;
        this.elements.completedTasks.textContent = completed;
    }

    changeTheme() {
        const theme = this.elements.themeSelect.value;
        document.body.className = theme;
        localStorage.setItem('theme', theme);
    }

    saveState() {
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        localStorage.setItem('theme', this.elements.themeSelect.value);
    }

    loadState() {
        this.tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        const theme = localStorage.getItem('theme') || 'default';
        this.elements.themeSelect.value = theme;
        document.body.className = theme;
        this.refreshTasks();
    }
}

document.addEventListener('DOMContentLoaded', () => new TodoApp());
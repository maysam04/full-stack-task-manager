const API_URL = "http://127.0.0.1:8001/tasks";

const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const taskList = document.getElementById("task-list");

async function loadTasks() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Failed to load tasks");
        }

        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error(error);
        taskList.textContent = "Failed to load tasks.";
    }
}

function renderTasks(tasks) {
    taskList.innerHTML = "";

    if (tasks.length === 0) {
        taskList.textContent = "No tasks yet.";
        return;
    }

    tasks.forEach(task => {
        const taskElement = document.createElement("div");
        taskElement.className = "task";

        if (task.completed) {
            taskElement.classList.add("completed");
        }

        const title = document.createElement("h3");
        title.textContent = task.title;

        const description = document.createElement("p");
        description.textContent = task.description || "No description";

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const toggleButton = document.createElement("button");
        toggleButton.textContent = task.completed
            ? "Mark Incomplete"
            : "Mark Complete";

        toggleButton.addEventListener("click", () => {
            toggleTask(task.id, task.completed);
        });

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";

        deleteButton.addEventListener("click", () => {
            deleteTask(task.id);
        });

        actions.appendChild(toggleButton);
        actions.appendChild(deleteButton);

        taskElement.appendChild(title);
        taskElement.appendChild(description);
        taskElement.appendChild(actions);

        taskList.appendChild(taskElement);
    });
}

async function createTask(title, description) {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                title: title,
                description: description,
                completed: false
            })
        });

        if (!response.ok) {
            throw new Error("Failed to create task");
        }

        await loadTasks();
    } catch (error) {
        console.error(error);
        alert("Failed to create task.");
    }
}

async function toggleTask(taskId, currentStatus) {
    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                completed: !currentStatus
            })
        });

        if (!response.ok) {
            throw new Error("Failed to update task");
        }

        await loadTasks();
    } catch (error) {
        console.error(error);
        alert("Failed to update task.");
    }
}

async function deleteTask(taskId) {
    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error("Failed to delete task");
        }

        await loadTasks();
    } catch (error) {
        console.error(error);
        alert("Failed to delete task.");
    }
}

taskForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!title) {
        return;
    }

    await createTask(title, description);

    taskForm.reset();
});

loadTasks();
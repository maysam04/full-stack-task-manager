const API_BASE_URL = "http://127.0.0.1:8001";

const authSection = document.getElementById("auth-section");
const appSection = document.getElementById("app-section");

const usernameInput = document.getElementById("username");
const passwordInput = document.getElementById("password");

const registerButton = document.getElementById("register-button");
const loginButton = document.getElementById("login-button");
const logoutButton = document.getElementById("logout-button");

const authMessage = document.getElementById("auth-message");
const welcomeMessage = document.getElementById("welcome-message");

const taskForm = document.getElementById("task-form");
const titleInput = document.getElementById("title");
const descriptionInput = document.getElementById("description");
const taskList = document.getElementById("task-list");

const TOKEN_KEY = "task_manager_token";
const USERNAME_KEY = "task_manager_username";


function getToken() {
    return localStorage.getItem(TOKEN_KEY);
}


function setToken(token, username) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USERNAME_KEY, username);
}


function clearToken() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USERNAME_KEY);
}


function getAuthHeaders(includeJson = false) {
    const headers = {};

    if (includeJson) {
        headers["Content-Type"] = "application/json";
    }

    const token = getToken();

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    return headers;
}


function showApp() {
    const username = localStorage.getItem(USERNAME_KEY);

    authSection.hidden = true;
    appSection.hidden = false;

    welcomeMessage.textContent = `Welcome, ${username}!`;

    loadTasks();
}


function showAuth() {
    authSection.hidden = false;
    appSection.hidden = true;
    taskList.innerHTML = "";
}


async function register() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
        authMessage.textContent = "Please enter username and password.";
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/auth/register`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    username: username,
                    password: password
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Registration failed.");
        }

        authMessage.textContent =
            "Registration successful. You can now log in.";

        passwordInput.value = "";

    } catch (error) {
        console.error(error);
        authMessage.textContent = error.message;
    }
}


async function login() {
    const username = usernameInput.value.trim();
    const password = passwordInput.value;

    if (!username || !password) {
        authMessage.textContent = "Please enter username and password.";
        return;
    }

    try {
        const formData = new URLSearchParams();

        formData.append("username", username);
        formData.append("password", password);

        const response = await fetch(
            `${API_BASE_URL}/auth/login`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: formData
            }
        );

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.detail || "Login failed.");
        }

        setToken(data.access_token, username);

        usernameInput.value = "";
        passwordInput.value = "";
        authMessage.textContent = "";

        showApp();

    } catch (error) {
        console.error(error);
        authMessage.textContent = error.message;
    }
}


async function loadTasks() {
    try {
        const response = await fetch(
            `${API_BASE_URL}/tasks`,
            {
                headers: getAuthHeaders()
            }
        );

        if (response.status === 401) {
            logout();
            return;
        }

        if (!response.ok) {
            throw new Error("Failed to load tasks.");
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
        description.textContent =
            task.description || "No description";

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
        const response = await fetch(
            `${API_BASE_URL}/tasks`,
            {
                method: "POST",
                headers: getAuthHeaders(true),
                body: JSON.stringify({
                    title: title,
                    description: description,
                    completed: false
                })
            }
        );

        if (response.status === 401) {
            logout();
            return;
        }

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.detail || "Failed to create task.");
        }

        await loadTasks();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}


async function toggleTask(taskId, currentStatus) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/tasks/${taskId}`,
            {
                method: "PUT",
                headers: getAuthHeaders(true),
                body: JSON.stringify({
                    completed: !currentStatus
                })
            }
        );

        if (response.status === 401) {
            logout();
            return;
        }

        if (!response.ok) {
            throw new Error("Failed to update task.");
        }

        await loadTasks();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}


async function deleteTask(taskId) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/tasks/${taskId}`,
            {
                method: "DELETE",
                headers: getAuthHeaders()
            }
        );

        if (response.status === 401) {
            logout();
            return;
        }

        if (!response.ok) {
            throw new Error("Failed to delete task.");
        }

        await loadTasks();

    } catch (error) {
        console.error(error);
        alert(error.message);
    }
}


function logout() {
    clearToken();
    showAuth();
    authMessage.textContent = "You have been logged out.";
}


registerButton.addEventListener("click", register);

loginButton.addEventListener("click", login);

logoutButton.addEventListener("click", logout);


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


if (getToken()) {
    showApp();
} else {
    showAuth();
}
# Full-Stack Task Manager

A simple full-stack Task Manager application built with **FastAPI**, **SQLite**, and a **Vanilla JavaScript** frontend.

The application allows users to create, view, update, complete, and delete tasks through a RESTful API and a simple web interface.

## Technologies Used

### Backend

* Python
* FastAPI
* SQLAlchemy
* SQLite
* Uvicorn
* Pydantic

### Frontend

* HTML5
* CSS3
* JavaScript
* Fetch API

## Features

* Create new tasks
* Display all tasks
* View task details through the REST API
* Mark tasks as completed or incomplete
* Delete tasks
* Persistent SQLite database storage
* RESTful API architecture
* CORS support for frontend-backend communication
* Responsive and simple user interface

## Project Structure

```text
full-stack-task-manager/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   └── schemas.py
│   ├── requirements.txt
│   └── tasks.db
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── README.md
```

## Backend Setup

### 1. Navigate to the backend

```bash
cd ~/full-stack-task-manager/backend
```

### 2. Create and activate a virtual environment

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Start the FastAPI server

```bash
uvicorn app.main:app --reload --port 8001
```

The API will be available at:

```text
http://127.0.0.1:8001
```

Interactive API documentation is available at:

```text
http://127.0.0.1:8001/docs
```

## Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd ~/full-stack-task-manager/frontend
```

Start a local HTTP server:

```bash
python3 -m http.server 5500
```

Then open:

```text
http://127.0.0.1:5500
```

The frontend communicates with the FastAPI backend using the Fetch API.

## API Endpoints

| Method | Endpoint      | Description       |
| ------ | ------------- | ----------------- |
| POST   | `/tasks`      | Create a new task |
| GET    | `/tasks`      | Get all tasks     |
| GET    | `/tasks/{id}` | Get a single task |
| PUT    | `/tasks/{id}` | Update a task     |
| DELETE | `/tasks/{id}` | Delete a task     |

## Task Data Model

Each task contains:

* `id` — Unique task identifier
* `title` — Task title
* `description` — Optional task description
* `completed` — Boolean completion status
* `created_at` — Task creation timestamp

Example:

```json
{
    "title": "Learn FastAPI",
    "description": "Practice CRUD operations",
    "completed": false
}
```

## Database Persistence

The application uses SQLite for persistent data storage.

The database file is:

```text
backend/tasks.db
```

Tasks remain available after restarting the FastAPI server because they are stored in the SQLite database rather than only in application memory.

## CORS

CORS is enabled in the FastAPI application so that the frontend running on port `5500` can communicate with the backend running on port `8001`.

## Running the Complete Application

Two terminals are required.

### Terminal 1 — Backend

```bash
cd ~/full-stack-task-manager/backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8001
```

### Terminal 2 — Frontend

```bash
cd ~/full-stack-task-manager/frontend
python3 -m http.server 5500
```

Then open:

```text
http://127.0.0.1:5500
```

## Verification

The application was tested by:

* Creating tasks through the frontend
* Loading tasks from the backend API
* Marking tasks as completed and incomplete
* Deleting tasks
* Restarting the FastAPI server
* Confirming that previously created tasks remained available after the restart

This verifies the CRUD functionality, frontend-backend integration, and SQLite persistence.

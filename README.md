# Full-Stack Task Manager

A simple full-stack Task Manager application built with **FastAPI**, **SQLAlchemy**, **SQLite**, **JWT authentication**, and a **Vanilla JavaScript** frontend.

The application allows registered users to securely create, view, update, complete, and delete their own tasks through a RESTful API and a simple web interface.

Each task belongs to the authenticated user, ensuring that users can only access and manage their own tasks.

---

## Technologies Used

### Backend

* Python
* FastAPI
* SQLAlchemy
* SQLite
* Uvicorn
* Pydantic
* JWT authentication with `python-jose`
* Password hashing with `pwdlib` and Argon2
* Pytest
* Pytest-Cov

### Frontend

* HTML5
* CSS3
* Vanilla JavaScript
* Fetch API
* Browser Local Storage

---

## Features

* User registration
* JWT-based authentication
* Secure password hashing
* Login and access token generation
* Protected task endpoints
* User-specific task ownership
* Users can only access their own tasks
* Create tasks
* Display tasks
* View individual task details through the REST API
* Update tasks
* Mark tasks as completed or incomplete
* Delete tasks
* Persistent SQLite database storage
* RESTful API architecture
* Automatic OpenAPI documentation with Swagger UI
* CORS support for frontend-backend communication
* Frontend authentication state using Local Storage
* Basic frontend error handling
* Empty task state handling
* Responsive and simple user interface
* Automated API tests
* 93% test coverage

---

## Project Structure

```text
full-stack-task-manager/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── auth.py
│   │   ├── database.py
│   │   ├── main.py
│   │   ├── models.py
│   │   ├── schemas.py
│   │   └── routers/
│   │       ├── __init__.py
│   │       ├── auth.py
│   │       └── tasks.py
│   │
│   ├── tests/
│   │   └── test_api.py
│   │
│   ├── requirements.txt
│   └── pytest.ini
│
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
│
└── README.md
```

The SQLite database file is generated locally when the backend runs and is not required to be included in the repository.

---

## Backend Setup

### 1. Navigate to the backend

```bash
cd backend
```

### 2. Create a virtual environment

```bash
python3 -m venv venv
```

### 3. Activate the virtual environment

Linux / macOS:

```bash
source venv/bin/activate
```

Windows:

```bash
venv\Scripts\activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Run the backend

```bash
uvicorn app.main:app --reload --port 8001
```

The API will be available at:

```text
http://127.0.0.1:8001
```

---

## Authentication

The application uses **JWT Bearer authentication**.

The authentication flow is:

1. A user registers with a username and password.
2. The password is securely hashed before being stored in the database.
3. The user logs in using their username and password.
4. The API verifies the credentials.
5. The API generates a JWT access token.
6. The frontend stores the token in browser Local Storage.
7. Protected requests include the token in the `Authorization` header.
8. The API identifies the current user from the token.
9. Task operations are restricted to tasks belonging to that user.

Example authorization header:

```text
Authorization: Bearer <access_token>
```

The authentication approach follows FastAPI's OAuth2 password and Bearer-token security pattern.

---

## API Endpoints

### Authentication Endpoints

| Method | Endpoint         | Authentication | Description                          |
| ------ | ---------------- | -------------- | ------------------------------------ |
| `POST` | `/auth/register` | No             | Register a new user                  |
| `POST` | `/auth/login`    | No             | Login and receive a JWT access token |

### Task Endpoints

| Method   | Endpoint           | Authentication | Description                  |
| -------- | ------------------ | -------------- | ---------------------------- |
| `POST`   | `/tasks`           | Required       | Create a new task            |
| `GET`    | `/tasks`           | Required       | Get the current user's tasks |
| `GET`    | `/tasks/{task_id}` | Required       | Get a specific task          |
| `PUT`    | `/tasks/{task_id}` | Required       | Update a task                |
| `DELETE` | `/tasks/{task_id}` | Required       | Delete a task                |

All task endpoints require a valid JWT access token.

---

## Authentication API

### Register

**Endpoint:**

```text
POST /auth/register
```

**Request body:**

```json
{
  "username": "maysam",
  "password": "password123"
}
```

**Successful response:**

```json
{
  "id": 1,
  "username": "maysam"
}
```

---

### Login

**Endpoint:**

```text
POST /auth/login
```

The login endpoint accepts `username` and `password` as form data.

**Successful response:**

```json
{
  "access_token": "<jwt-token>",
  "token_type": "bearer"
}
```

The returned token must be included in the `Authorization` header when accessing protected task endpoints.

---

## Task API

### Create a Task

**Endpoint:**

```text
POST /tasks
```

**Authorization:**

```text
Bearer <access_token>
```

**Request body:**

```json
{
  "title": "Complete internship task",
  "description": "Finish the Task Manager project",
  "completed": false
}
```

**Response:**

```json
{
  "id": 1,
  "title": "Complete internship task",
  "description": "Finish the Task Manager project",
  "completed": false,
  "created_at": "2026-09-09T14:00:00",
  "user_id": 1
}
```

---

### Get All Tasks

**Endpoint:**

```text
GET /tasks
```

Returns only the tasks belonging to the authenticated user.

---

### Get a Single Task

**Endpoint:**

```text
GET /tasks/{task_id}
```

Returns the requested task if it belongs to the authenticated user.

If the task does not exist or belongs to another user, the API returns:

```text
404 Not Found
```

---

### Update a Task

**Endpoint:**

```text
PUT /tasks/{task_id}
```

**Request body:**

```json
{
  "title": "Updated task",
  "description": "Updated description",
  "completed": true
}
```

The fields are optional, so individual task properties can be updated without replacing the entire task.

---

### Delete a Task

**Endpoint:**

```text
DELETE /tasks/{task_id}
```

Deletes the specified task if it belongs to the authenticated user.

Successful deletion returns:

```text
204 No Content
```

---

## Data Models

### User

The `User` model contains:

| Field           | Type    | Description              |
| --------------- | ------- | ------------------------ |
| `id`            | Integer | Unique user identifier   |
| `username`      | String  | Unique username          |
| `password_hash` | String  | Securely hashed password |

Users have a one-to-many relationship with tasks.

---

### Task

The `Task` model contains:

| Field         | Type     | Description               |
| ------------- | -------- | ------------------------- |
| `id`          | Integer  | Unique task identifier    |
| `title`       | String   | Task title                |
| `description` | Text     | Optional task description |
| `completed`   | Boolean  | Completion status         |
| `created_at`  | DateTime | Task creation timestamp   |
| `user_id`     | Integer  | ID of the task owner      |

The `user_id` field creates a relationship between each task and its owner.

---

## User Data Isolation

Each task is associated with the authenticated user's ID.

When a user requests their tasks, the API filters tasks using the current user's ID.

For example:

```python
db.query(Task).filter(
    Task.user_id == current_user.id
).all()
```

The same ownership check is applied when retrieving, updating, or deleting an individual task.

This prevents one authenticated user from accessing or modifying another user's tasks.

---

## Frontend

The frontend is a lightweight web interface built with HTML, CSS, and Vanilla JavaScript.

It communicates with the FastAPI backend using the Fetch API.

### Frontend Features

* User registration
* User login
* Logout
* JWT token storage
* Create tasks
* Display tasks
* Mark tasks as completed
* Update tasks
* Delete tasks
* Empty task state
* Basic error messages
* Automatic handling of expired/invalid authentication

The JWT token is stored in browser Local Storage and included in protected API requests using the Bearer authentication scheme.

---

## Running the Frontend

The frontend can be served using a simple local HTTP server.

From the `frontend` directory:

```bash
python3 -m http.server 5500
```

Then open:

```text
http://127.0.0.1:5500
```

Make sure the backend is also running on port `8001`.

---

## Database

The project uses **SQLite** with **SQLAlchemy ORM**.

The database URL is:

```text
sqlite:///./tasks.db
```

The database is created automatically when the backend application starts.

The database stores:

* Users
* Password hashes
* Tasks
* Task ownership relationships

The local SQLite database file is excluded from version control.

---

## CORS

CORS middleware is enabled in the FastAPI application to allow the frontend and backend to communicate when they run on different local ports.

The backend allows:

* Frontend requests
* HTTP methods
* Authorization headers
* Cross-origin communication during local development

---

## API Documentation

FastAPI automatically generates interactive OpenAPI documentation.

After starting the backend, open:

### Swagger UI

```text
http://127.0.0.1:8001/docs
```

### ReDoc

```text
http://127.0.0.1:8001/redoc
```

Swagger UI can be used to test the authentication and task endpoints directly from the browser.

---

## Testing

The project includes automated API tests using **Pytest**.

The test suite covers:

* User registration
* User login
* Authentication requirements
* Task creation
* Task retrieval
* Task updating
* Task deletion
* User task isolation
* Non-existent task handling

Run the tests from the `backend` directory:

```bash
pytest -q
```

Current result:

```text
8 passed
```

---

## Test Coverage

Coverage is measured using `pytest-cov`.

Run:

```bash
pytest --cov=app --cov-report=term-missing -q
```

Current coverage:

```text
TOTAL    174 statements    13 missed    93%
```

The project currently achieves **93% test coverage**.

---

## Complete Application Setup

### Start the Backend

```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8001
```

### Start the Frontend

Open another terminal:

```bash
cd frontend
python3 -m http.server 5500
```

Then open:

```text
http://127.0.0.1:5500
```

The application is now ready to use.

---

## Example Application Flow

1. Open the frontend.
2. Create a new account.
3. Login with the registered account.
4. Create a task.
5. View the task in the task list.
6. Mark the task as completed.
7. Update the task if needed.
8. Delete the task.
9. Logout.
10. Login again and verify that the tasks are still stored in SQLite.

---

## Project Verification

The following components have been implemented and tested:

* FastAPI REST API
* SQLAlchemy ORM
* SQLite database
* User registration
* JWT authentication
* Secure password hashing
* Protected endpoints
* User-specific task ownership
* Complete task CRUD operations
* Vanilla JavaScript frontend
* Frontend-backend integration
* CORS configuration
* Swagger/OpenAPI documentation
* Automated API tests
* 93% test coverage

---

## License

This project was developed as a full-stack web development project for educational and internship purposes.

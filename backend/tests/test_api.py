from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base, get_db
from app.main import app


TEST_DATABASE_URL = "sqlite:///./test_tasks.db"

test_engine = create_engine(
    TEST_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

TestingSessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=test_engine
)


def override_get_db():
    db = TestingSessionLocal()

    try:
        yield db
    finally:
        db.close()


app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)


def setup_function():
    Base.metadata.drop_all(bind=test_engine)
    Base.metadata.create_all(bind=test_engine)


def teardown_function():
    Base.metadata.drop_all(bind=test_engine)


def register_user(username: str, password: str = "test123"):
    return client.post(
        "/auth/register",
        json={
            "username": username,
            "password": password
        }
    )


def get_auth_token(username: str, password: str = "test123") -> str:
    response = client.post(
        "/auth/login",
        data={
            "username": username,
            "password": password
        }
    )

    return response.json()["access_token"]


def auth_headers(token: str):
    return {
        "Authorization": f"Bearer {token}"
    }


def test_register_user():
    response = register_user("testuser")

    assert response.status_code == 201

    data = response.json()

    assert data["username"] == "testuser"
    assert "id" in data
    assert "password" not in data
    assert "password_hash" not in data


def test_login_user():
    register_user("testuser")

    response = client.post(
        "/auth/login",
        data={
            "username": "testuser",
            "password": "test123"
        }
    )

    assert response.status_code == 200

    data = response.json()

    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_tasks_require_authentication():
    response = client.get("/tasks")

    assert response.status_code == 401


def test_create_and_get_task():
    register_user("testuser")

    token = get_auth_token("testuser")

    response = client.post(
        "/tasks",
        json={
            "title": "Test Task",
            "description": "Test description"
        },
        headers=auth_headers(token)
    )

    assert response.status_code == 201

    task = response.json()

    assert task["title"] == "Test Task"
    assert task["description"] == "Test description"
    assert task["completed"] is False
    assert "id" in task
    assert "user_id" in task

    response = client.get(
        "/tasks",
        headers=auth_headers(token)
    )

    assert response.status_code == 200

    tasks = response.json()

    assert len(tasks) == 1
    assert tasks[0]["title"] == "Test Task"


def test_update_task():
    register_user("testuser")

    token = get_auth_token("testuser")

    create_response = client.post(
        "/tasks",
        json={
            "title": "Original Task",
            "description": "Original description"
        },
        headers=auth_headers(token)
    )

    task_id = create_response.json()["id"]

    response = client.put(
        f"/tasks/{task_id}",
        json={
            "title": "Updated Task",
            "completed": True
        },
        headers=auth_headers(token)
    )

    assert response.status_code == 200

    updated_task = response.json()

    assert updated_task["title"] == "Updated Task"
    assert updated_task["completed"] is True
    assert updated_task["description"] == "Original description"


def test_delete_task():
    register_user("testuser")

    token = get_auth_token("testuser")

    create_response = client.post(
        "/tasks",
        json={
            "title": "Task to delete",
            "description": "This task will be deleted"
        },
        headers=auth_headers(token)
    )

    task_id = create_response.json()["id"]

    response = client.delete(
        f"/tasks/{task_id}",
        headers=auth_headers(token)
    )

    assert response.status_code == 204

    response = client.get(
        f"/tasks/{task_id}",
        headers=auth_headers(token)
    )

    assert response.status_code == 404


def test_users_can_only_access_their_own_tasks():
    register_user("user1")
    register_user("user2")

    token1 = get_auth_token("user1")
    token2 = get_auth_token("user2")

    create_response = client.post(
        "/tasks",
        json={
            "title": "User 1 Task",
            "description": "Private task"
        },
        headers=auth_headers(token1)
    )

    assert create_response.status_code == 201

    task_id = create_response.json()["id"]

    response = client.get(
        "/tasks",
        headers=auth_headers(token2)
    )

    assert response.status_code == 200
    assert response.json() == []

    response = client.get(
        f"/tasks/{task_id}",
        headers=auth_headers(token2)
    )

    assert response.status_code == 404

    response = client.put(
        f"/tasks/{task_id}",
        json={
            "title": "Unauthorized update"
        },
        headers=auth_headers(token2)
    )

    assert response.status_code == 404

    response = client.delete(
        f"/tasks/{task_id}",
        headers=auth_headers(token2)
    )

    assert response.status_code == 404


def test_nonexistent_task_returns_404():
    register_user("testuser")

    token = get_auth_token("testuser")

    response = client.get(
        "/tasks/9999",
        headers=auth_headers(token)
    )

    assert response.status_code == 404
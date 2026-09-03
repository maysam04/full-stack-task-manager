from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from . import models
from .routers import tasks

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Full-Stack Task Manager API",
    description="A simple Task Manager REST API built with FastAPI and SQLite.",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(tasks.router)


@app.get("/")
def root():
    return {"message": "Task Manager API is running"}
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class TaskBase(BaseModel):
    title: str
    description: str | None = None
    completed: bool = False


class TaskCreate(TaskBase):
    pass


class TaskUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    completed: bool | None = None


class TaskResponse(TaskBase):
    id: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
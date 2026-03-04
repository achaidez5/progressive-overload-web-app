from pydantic import BaseModel
from typing import Optional


class WorkoutCreate(BaseModel):
    exercise: str
    sets: int
    reps: int
    weight: float
    date: str
    notes: Optional[str] = None


class WorkoutResponse(WorkoutCreate):
    id: int

    model_config = {"from_attributes": True}

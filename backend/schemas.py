from pydantic import BaseModel
from typing import Optional


# ── Set schemas ──────────────────────────────────────────────────────────────

class SetCreate(BaseModel):
    exercise_id: int
    set_number: int
    reps: int
    weight: float


class SetUpdate(BaseModel):
    reps: Optional[int] = None
    weight: Optional[float] = None


class SetResponse(BaseModel):
    id: int
    exercise_id: int
    set_number: int
    reps: int
    weight: float

    model_config = {"from_attributes": True}


# ── Exercise schemas ──────────────────────────────────────────────────────────

class ExerciseCreate(BaseModel):
    name: str
    date: str  # "YYYY-MM-DD" — used to look up or create the WorkoutDay


class ExerciseUpdate(BaseModel):
    name: str


class ExerciseResponse(BaseModel):
    id: int
    name: str
    workout_day_id: int
    sets: list[SetResponse] = []

    model_config = {"from_attributes": True}


# ── WorkoutDay schemas ────────────────────────────────────────────────────────

class WorkoutDayTitleUpdate(BaseModel):
    title: Optional[str] = None


class WorkoutDayResponse(BaseModel):
    id: int
    date: str
    title: Optional[str] = None
    exercises: list[ExerciseResponse] = []

    model_config = {"from_attributes": True}


# ── Calendar / Recent schemas ─────────────────────────────────────────────────

class CalendarDayResponse(BaseModel):
    date: str
    title: Optional[str] = None
    exercise_count: int = 0


class RecentDayResponse(BaseModel):
    date: str
    title: Optional[str] = None
    exercise_count: int

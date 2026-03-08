from datetime import date as date_type, timedelta

from fastapi import Depends, FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import func, text
from sqlalchemy.orm import Session

from database import Base, SessionLocal, engine
from models import Exercise, Set, WorkoutDay
from schemas import (
    CalendarDayResponse,
    ExerciseCreate,
    ExerciseResponse,
    ExerciseUpdate,
    RecentDayResponse,
    SetCreate,
    SetResponse,
    SetUpdate,
    WorkoutDayResponse,
    WorkoutDayTitleUpdate,
)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)

# Runtime migration: add title column to existing databases
with engine.connect() as _conn:
    try:
        _conn.execute(text("ALTER TABLE workout_days ADD COLUMN title TEXT"))
        _conn.commit()
    except Exception:
        pass  # Column already exists


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ── Health ────────────────────────────────────────────────────────────────────

@app.get("/")
def health_check():
    return {"status": "ok"}


# ── Days ──────────────────────────────────────────────────────────────────────

@app.get("/days/recent/list", response_model=list[RecentDayResponse])
def get_recent_days(limit: int = 5, db: Session = Depends(get_db)):
    days = (
        db.query(WorkoutDay)
        .filter(WorkoutDay.exercises.any())
        .order_by(WorkoutDay.date.desc())
        .limit(limit)
        .all()
    )
    return [
        {"date": d.date, "title": d.title, "exercise_count": len(d.exercises)}
        for d in days
    ]


@app.get("/days/{date}", response_model=WorkoutDayResponse)
def get_or_create_day(date: str, db: Session = Depends(get_db)):
    day = db.query(WorkoutDay).filter(WorkoutDay.date == date).first()
    if not day:
        day = WorkoutDay(date=date)
        db.add(day)
        db.commit()
        db.refresh(day)
    return day


@app.put("/days/{date}", response_model=WorkoutDayResponse)
def update_day_title(date: str, body: WorkoutDayTitleUpdate, db: Session = Depends(get_db)):
    day = db.query(WorkoutDay).filter(WorkoutDay.date == date).first()
    if not day:
        day = WorkoutDay(date=date, title=body.title)
        db.add(day)
    else:
        day.title = body.title
    db.commit()
    db.refresh(day)
    return day


@app.get("/days/{date}/exercises", response_model=list[ExerciseResponse])
def get_exercises_for_day(date: str, db: Session = Depends(get_db)):
    day = db.query(WorkoutDay).filter(WorkoutDay.date == date).first()
    if not day:
        return []
    return day.exercises


# ── Calendar ──────────────────────────────────────────────────────────────────

@app.get("/calendar/{year}/{month}", response_model=list[CalendarDayResponse])
def get_calendar_month(year: int, month: int, db: Session = Depends(get_db)):
    prefix = f"{year}-{month:02d}"
    days = (
        db.query(WorkoutDay)
        .filter(WorkoutDay.date.like(f"{prefix}%"))
        .all()
    )
    return [
        {"date": d.date, "title": d.title, "exercise_count": len(d.exercises)}
        for d in days if d.exercises
    ]


# ── Streak ────────────────────────────────────────────────────────────────────

@app.get("/streak")
def get_streak(db: Session = Depends(get_db)):
    dates_rows = (
        db.query(WorkoutDay.date)
        .filter(WorkoutDay.exercises.any())
        .all()
    )
    dates = {row[0] for row in dates_rows}

    today = date_type.today()
    streak = 0
    check = today

    while str(check) in dates:
        streak += 1
        check = check - timedelta(days=1)

    # Streak still active if last workout was yesterday
    if streak == 0:
        check = today - timedelta(days=1)
        while str(check) in dates:
            streak += 1
            check = check - timedelta(days=1)

    return {"streak": streak}


# ── Exercises ─────────────────────────────────────────────────────────────────

@app.post("/exercises", response_model=ExerciseResponse, status_code=201)
def create_exercise(body: ExerciseCreate, db: Session = Depends(get_db)):
    day = db.query(WorkoutDay).filter(WorkoutDay.date == body.date).first()
    if not day:
        day = WorkoutDay(date=body.date)
        db.add(day)
        db.commit()
        db.refresh(day)

    exercise = Exercise(name=body.name, workout_day_id=day.id)
    db.add(exercise)
    db.commit()
    db.refresh(exercise)
    return exercise


@app.put("/exercises/{exercise_id}", response_model=ExerciseResponse)
def update_exercise(exercise_id: int, body: ExerciseUpdate, db: Session = Depends(get_db)):
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")
    exercise.name = body.name
    db.commit()
    db.refresh(exercise)
    return exercise


@app.delete("/exercises/{exercise_id}", status_code=204)
def delete_exercise(exercise_id: int, db: Session = Depends(get_db)):
    exercise = db.query(Exercise).filter(Exercise.id == exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")
    db.delete(exercise)
    db.commit()


# ── Sets ──────────────────────────────────────────────────────────────────────

@app.post("/sets", response_model=SetResponse, status_code=201)
def create_set(body: SetCreate, db: Session = Depends(get_db)):
    exercise = db.query(Exercise).filter(Exercise.id == body.exercise_id).first()
    if not exercise:
        raise HTTPException(status_code=404, detail="Exercise not found")
    new_set = Set(**body.model_dump())
    db.add(new_set)
    db.commit()
    db.refresh(new_set)
    return new_set


@app.put("/sets/{set_id}", response_model=SetResponse)
def update_set(set_id: int, body: SetUpdate, db: Session = Depends(get_db)):
    s = db.query(Set).filter(Set.id == set_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Set not found")
    if body.reps is not None:
        s.reps = body.reps
    if body.weight is not None:
        s.weight = body.weight
    db.commit()
    db.refresh(s)
    return s


@app.delete("/sets/{set_id}", status_code=204)
def delete_set(set_id: int, db: Session = Depends(get_db)):
    s = db.query(Set).filter(Set.id == set_id).first()
    if not s:
        raise HTTPException(status_code=404, detail="Set not found")
    db.delete(s)
    db.commit()


# ── Progressive Overload ──────────────────────────────────────────────────────

@app.get("/exercises/{name}/history")
def get_exercise_history(name: str, db: Session = Depends(get_db)):
    """Return the last 2 sessions for delta badge computation."""
    exercises = (
        db.query(Exercise)
        .filter(Exercise.name == name)
        .join(WorkoutDay)
        .order_by(WorkoutDay.date.desc())
        .limit(2)
        .all()
    )

    result = []
    for ex in exercises:
        sets_data = [
            {"set_number": s.set_number, "reps": s.reps, "weight": s.weight}
            for s in ex.sets
        ]
        max_w = max((s.weight for s in ex.sets), default=0)
        result.append({
            "date": ex.workout_day.date,
            "max_weight": max_w,
            "sets": sets_data,
        })
    return result


@app.get("/exercises/{name}/max")
def get_exercise_max(name: str, exclude_date: str = None, db: Session = Depends(get_db)):
    """Return the all-time max weight, optionally excluding a date (used for PR detection)."""
    query = (
        db.query(func.max(Set.weight))
        .join(Exercise)
        .join(WorkoutDay)
        .filter(Exercise.name == name)
    )
    if exclude_date:
        query = query.filter(WorkoutDay.date != exclude_date)
    max_weight = query.scalar() or 0
    return {"max_weight": float(max_weight)}

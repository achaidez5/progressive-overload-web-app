from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship

from database import Base


class WorkoutDay(Base):
    __tablename__ = "workout_days"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    date = Column(String, unique=True, nullable=False, index=True)  # "YYYY-MM-DD"
    title = Column(String, nullable=True)  # e.g. "Push Day"

    exercises = relationship(
        "Exercise", back_populates="workout_day", cascade="all, delete-orphan"
    )


class Exercise(Base):
    __tablename__ = "exercises"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    name = Column(String, nullable=False)
    workout_day_id = Column(Integer, ForeignKey("workout_days.id"), nullable=False)

    workout_day = relationship("WorkoutDay", back_populates="exercises")
    sets = relationship(
        "Set", back_populates="exercise", cascade="all, delete-orphan"
    )


class Set(Base):
    __tablename__ = "sets"

    id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    exercise_id = Column(Integer, ForeignKey("exercises.id"), nullable=False)
    set_number = Column(Integer, nullable=False)
    reps = Column(Integer, nullable=False)
    weight = Column(Float, nullable=False)

    exercise = relationship("Exercise", back_populates="sets")

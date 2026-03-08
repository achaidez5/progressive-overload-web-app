const BASE = "http://localhost:8000"

// Days
export const getOrCreateDay = (date) =>
  fetch(`${BASE}/days/${date}`).then((r) => r.json())

export const getExercisesForDay = (date) =>
  fetch(`${BASE}/days/${date}/exercises`).then((r) => r.json())

// Calendar
export const getCalendarMonth = (year, month) =>
  fetch(`${BASE}/calendar/${year}/${month}`).then((r) => r.json())

// Exercises
export const createExercise = (name, date) =>
  fetch(`${BASE}/exercises`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, date }),
  }).then((r) => r.json())

export const updateExercise = (id, name) =>
  fetch(`${BASE}/exercises/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  }).then((r) => r.json())

export const deleteExercise = (id) =>
  fetch(`${BASE}/exercises/${id}`, { method: "DELETE" })

// Sets
export const createSet = (exercise_id, set_number, reps, weight) =>
  fetch(`${BASE}/sets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ exercise_id, set_number, reps, weight }),
  }).then((r) => r.json())

export const updateSet = (id, reps, weight) =>
  fetch(`${BASE}/sets/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ reps, weight }),
  }).then((r) => r.json())

export const deleteSet = (id) =>
  fetch(`${BASE}/sets/${id}`, { method: "DELETE" })

// History (progressive overload)
export const getExerciseHistory = (name) =>
  fetch(`${BASE}/exercises/${encodeURIComponent(name)}/history`).then((r) =>
    r.json()
  )

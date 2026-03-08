import { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getExercisesForDay, createExercise } from '../api'
import ExerciseCard from '../components/ExerciseCard'

export default function DayPage() {
  const { date } = useParams()
  const navigate = useNavigate()
  const [exercises, setExercises] = useState([])
  const [newExerciseName, setNewExerciseName] = useState('')
  const [showAddForm, setShowAddForm] = useState(false)
  const [loading, setLoading] = useState(true)

  // "2026-03-08" → "Saturday, March 8, 2026" (T00:00:00 avoids UTC offset bug)
  const displayDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  const loadExercises = useCallback(async () => {
    const data = await getExercisesForDay(date)
    setExercises(data)
    setLoading(false)
  }, [date])

  useEffect(() => {
    loadExercises()
  }, [loadExercises])

  async function handleAddExercise(e) {
    e.preventDefault()
    if (!newExerciseName.trim()) return
    await createExercise(newExerciseName.trim(), date)
    setNewExerciseName('')
    setShowAddForm(false)
    loadExercises()
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-6">
      {/* Back button */}
      <button
        onClick={() => navigate('/')}
        className="mb-5 text-sm flex items-center gap-1 transition-opacity hover:opacity-70"
        style={{ color: '#00FF87' }}
      >
        ← Calendar
      </button>

      {/* Date header */}
      <h2 className="text-xl font-bold mb-1">{displayDate}</h2>
      <p className="text-sm mb-6" style={{ color: '#555' }}>
        {exercises.length} exercise{exercises.length !== 1 ? 's' : ''} logged
      </p>

      {/* Exercise cards */}
      {loading ? (
        <p className="text-sm" style={{ color: '#555' }}>Loading...</p>
      ) : (
        <div className="flex flex-col gap-4">
          {exercises.map((exercise) => (
            <ExerciseCard
              key={exercise.id}
              exercise={exercise}
              date={date}
              onChanged={loadExercises}
            />
          ))}
        </div>
      )}

      {/* Add exercise */}
      <div className="mt-6">
        {!showAddForm ? (
          <button
            onClick={() => setShowAddForm(true)}
            className="w-full py-3 rounded-xl font-semibold text-sm transition-opacity hover:opacity-80"
            style={{
              backgroundColor: 'transparent',
              border: '1px dashed #00FF87',
              color: '#00FF87',
            }}
          >
            + Add Exercise
          </button>
        ) : (
          <form onSubmit={handleAddExercise} className="flex gap-2">
            <input
              autoFocus
              type="text"
              value={newExerciseName}
              onChange={(e) => setNewExerciseName(e.target.value)}
              placeholder="e.g. Bench Press"
              className="flex-1 rounded-xl px-4 py-2 text-sm focus:outline-none"
              style={{
                backgroundColor: '#1a1a1a',
                border: '1px solid #00FF87',
                color: '#f5f5f5',
              }}
            />
            <button
              type="submit"
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-opacity hover:opacity-80"
              style={{ backgroundColor: '#00FF87', color: '#0a0a0a' }}
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => { setShowAddForm(false); setNewExerciseName('') }}
              className="px-4 py-2 rounded-xl text-sm transition-colors"
              style={{ backgroundColor: '#1a1a1a', color: '#888' }}
            >
              Cancel
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

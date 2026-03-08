import { useState, useEffect } from 'react'
import { updateExercise, deleteExercise, createSet, getExerciseHistory } from '../api'
import SetRow from './SetRow'

export default function ExerciseCard({ exercise, date, onChanged }) {
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameValue, setNameValue] = useState(exercise.name)
  const [badge, setBadge] = useState(null) // {label, color}

  // Compute progressive overload badge
  useEffect(() => {
    getExerciseHistory(exercise.name).then((history) => {
      if (history.length < 2) { setBadge(null); return }
      const currentMax = history[0].max_weight
      const prevMax = history[1].max_weight
      const diff = parseFloat((currentMax - prevMax).toFixed(1))
      if (diff > 0) setBadge({ label: `↑ ${diff} lbs from last session`, color: '#00FF87' })
      else if (diff < 0) setBadge({ label: `↓ ${Math.abs(diff)} lbs from last session`, color: '#FF4444' })
      else setBadge({ label: '= Same as last session', color: '#888' })
    })
  }, [exercise.name, exercise.sets])

  async function handleRenameSubmit(e) {
    e?.preventDefault()
    if (!nameValue.trim() || nameValue === exercise.name) {
      setIsEditingName(false)
      setNameValue(exercise.name)
      return
    }
    await updateExercise(exercise.id, nameValue.trim())
    setIsEditingName(false)
    onChanged()
  }

  async function handleDelete() {
    if (!confirm(`Delete "${exercise.name}" and all its sets?`)) return
    await deleteExercise(exercise.id)
    onChanged()
  }

  async function handleAddSet() {
    const nextSetNumber = exercise.sets.length + 1
    const lastSet = exercise.sets[exercise.sets.length - 1]
    const reps = lastSet?.reps ?? 8
    const weight = lastSet?.weight ?? 0
    await createSet(exercise.id, nextSetNumber, reps, weight)
    onChanged()
  }

  return (
    <div className="rounded-2xl p-4" style={{ backgroundColor: '#1a1a1a' }}>
      {/* Exercise name row */}
      <div className="flex items-center justify-between mb-1">
        {isEditingName ? (
          <form onSubmit={handleRenameSubmit} className="flex-1 mr-2">
            <input
              autoFocus
              value={nameValue}
              onChange={(e) => setNameValue(e.target.value)}
              onBlur={handleRenameSubmit}
              className="w-full bg-transparent border-b text-base font-semibold focus:outline-none"
              style={{ borderColor: '#00FF87', color: '#f5f5f5' }}
            />
          </form>
        ) : (
          <h3
            className="text-base font-semibold cursor-pointer hover:opacity-70 transition-opacity"
            onClick={() => setIsEditingName(true)}
            title="Click to rename"
          >
            {exercise.name}
          </h3>
        )}
        <button
          onClick={handleDelete}
          className="text-xs transition-colors ml-2 shrink-0"
          style={{ color: '#555' }}
          onMouseEnter={(e) => e.target.style.color = '#FF4444'}
          onMouseLeave={(e) => e.target.style.color = '#555'}
        >
          Delete
        </button>
      </div>

      {/* Progressive overload badge */}
      {badge && (
        <p className="text-xs font-semibold mb-3" style={{ color: badge.color }}>
          {badge.label}
        </p>
      )}

      {/* Sets table */}
      {exercise.sets.length > 0 && (
        <div className="mb-3">
          <div className="grid grid-cols-4 text-xs mb-1 px-1" style={{ color: '#555' }}>
            <span>Set</span>
            <span>Reps</span>
            <span>Weight</span>
            <span></span>
          </div>
          {[...exercise.sets]
            .sort((a, b) => a.set_number - b.set_number)
            .map((set) => (
              <SetRow
                key={`${set.id}-${set.reps}-${set.weight}`}
                set={set}
                onChanged={onChanged}
              />
            ))}
        </div>
      )}

      {/* Add set button */}
      <button
        onClick={handleAddSet}
        className="text-xs font-semibold transition-opacity hover:opacity-70"
        style={{ color: '#00FF87' }}
      >
        + Add Set
      </button>
    </div>
  )
}

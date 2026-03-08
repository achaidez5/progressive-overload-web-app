import { useState } from 'react'
import { updateSet, deleteSet } from '../api'

export default function SetRow({ set, onChanged }) {
  const [editingReps, setEditingReps] = useState(false)
  const [editingWeight, setEditingWeight] = useState(false)
  const [reps, setReps] = useState(set.reps)
  const [weight, setWeight] = useState(set.weight)

  async function saveReps() {
    setEditingReps(false)
    const newReps = Number(reps)
    if (newReps !== set.reps) {
      await updateSet(set.id, newReps, set.weight)
      onChanged()
    }
  }

  async function saveWeight() {
    setEditingWeight(false)
    const newWeight = Number(weight)
    if (newWeight !== set.weight) {
      await updateSet(set.id, set.reps, newWeight)
      onChanged()
    }
  }

  async function handleDelete() {
    await deleteSet(set.id)
    onChanged()
  }

  return (
    <div
      className="grid grid-cols-4 items-center py-1.5 px-1 rounded-lg transition-colors"
      style={{ ':hover': { backgroundColor: 'rgba(255,255,255,0.05)' } }}
    >
      {/* Set number */}
      <span className="text-sm" style={{ color: '#888' }}>{set.set_number}</span>

      {/* Reps */}
      <span>
        {editingReps ? (
          <input
            autoFocus
            type="number"
            value={reps}
            onChange={(e) => setReps(e.target.value)}
            onBlur={saveReps}
            onKeyDown={(e) => e.key === 'Enter' && saveReps()}
            className="w-16 bg-transparent border-b text-sm focus:outline-none"
            style={{ borderColor: '#00FF87', color: '#f5f5f5' }}
          />
        ) : (
          <span
            className="text-sm cursor-pointer transition-colors hover:text-green-400"
            onClick={() => setEditingReps(true)}
          >
            {reps}
          </span>
        )}
      </span>

      {/* Weight */}
      <span>
        {editingWeight ? (
          <input
            autoFocus
            type="number"
            step="0.5"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            onBlur={saveWeight}
            onKeyDown={(e) => e.key === 'Enter' && saveWeight()}
            className="w-20 bg-transparent border-b text-sm focus:outline-none"
            style={{ borderColor: '#00FF87', color: '#f5f5f5' }}
          />
        ) : (
          <span
            className="text-sm cursor-pointer transition-colors hover:text-green-400"
            onClick={() => setEditingWeight(true)}
          >
            {weight} lbs
          </span>
        )}
      </span>

      {/* Delete */}
      <span className="flex justify-end">
        <button
          onClick={handleDelete}
          className="text-xs transition-colors"
          style={{ color: '#555' }}
          onMouseEnter={(e) => e.target.style.color = '#FF4444'}
          onMouseLeave={(e) => e.target.style.color = '#555'}
        >
          ✕
        </button>
      </span>
    </div>
  )
}

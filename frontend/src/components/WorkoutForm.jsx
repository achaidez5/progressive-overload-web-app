import { useState } from 'react'

const today = new Date().toISOString().split('T')[0]

function WorkoutForm() {
  const [form, setForm] = useState({
    exercise: '',
    sets: '',
    reps: '',
    weight: '',
    date: today,
    notes: '',
  })
  const [message, setMessage] = useState(null)

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setMessage(null)

    if (!form.exercise || !form.sets || !form.reps || !form.weight) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' })
      return
    }

    try {
      const res = await fetch('http://localhost:8000/workouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          exercise: form.exercise,
          sets: Number(form.sets),
          reps: Number(form.reps),
          weight: Number(form.weight),
          date: form.date,
          notes: form.notes || null,
        }),
      })

      if (!res.ok) throw new Error()

      setForm({ exercise: '', sets: '', reps: '', weight: '', date: today, notes: '' })
      setMessage({ type: 'success', text: 'Workout logged!' })
    } catch {
      setMessage({ type: 'error', text: 'Something went wrong. Try again.' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Exercise *</label>
        <input
          type="text"
          name="exercise"
          value={form.exercise}
          onChange={handleChange}
          placeholder="e.g. Bench Press"
          className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Sets *</label>
          <input
            type="number"
            name="sets"
            value={form.sets}
            onChange={handleChange}
            min="1"
            placeholder="3"
            className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Reps *</label>
          <input
            type="number"
            name="reps"
            value={form.reps}
            onChange={handleChange}
            min="1"
            placeholder="10"
            className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-1">Weight (lbs) *</label>
          <input
            type="number"
            name="weight"
            value={form.weight}
            onChange={handleChange}
            min="0"
            step="0.5"
            placeholder="135"
            className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Date *</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white focus:outline-none focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-1">Notes</label>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          rows="2"
          placeholder="Optional notes..."
          className="w-full rounded-lg bg-gray-800 border border-gray-700 px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-500 transition-colors"
      >
        Log Workout
      </button>

      {message && (
        <p className={message.type === 'success' ? 'text-green-400 text-sm' : 'text-red-400 text-sm'}>
          {message.text}
        </p>
      )}
    </form>
  )
}

export default WorkoutForm

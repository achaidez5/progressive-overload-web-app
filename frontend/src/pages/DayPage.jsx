import { useState, useEffect, useCallback, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getOrCreateDay, getExercisesForDay, updateDayTitle, createExercise } from '../api'
import ExerciseCard from '../components/ExerciseCard'
import AddExerciseSheet from '../components/AddExerciseSheet'
import { T, gradientStyle } from '../theme'

export default function DayPage() {
  const { date } = useParams()
  const navigate = useNavigate()
  const [exercises, setExercises] = useState([])
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [editingTitle, setEditingTitle] = useState(false)
  const [titleInput, setTitleInput] = useState('')
  const [showSheet, setShowSheet] = useState(false)
  const titleInputRef = useRef(null)

  // "2026-03-08" → "March 8, 2026"
  const displayDate = new Date(date + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })

  const loadData = useCallback(async () => {
    const [day, exs] = await Promise.all([
      getOrCreateDay(date),
      getExercisesForDay(date),
    ])
    setTitle(day.title || '')
    setExercises(exs)
    setLoading(false)
  }, [date])

  useEffect(() => { loadData() }, [loadData])

  // Focus title input when entering edit mode
  useEffect(() => {
    if (editingTitle) titleInputRef.current?.focus()
  }, [editingTitle])

  function startEditTitle() {
    setTitleInput(title)
    setEditingTitle(true)
  }

  async function saveTitle() {
    setEditingTitle(false)
    const trimmed = titleInput.trim()
    if (trimmed === title) return
    setTitle(trimmed)
    await updateDayTitle(date, trimmed || null)
  }

  async function handleAddExercise(name) {
    await createExercise(name, date)
    loadData()
  }

  return (
    <>
      {/* Scrollable content */}
      <div style={{
        maxWidth: T.maxW, margin: '0 auto',
        padding: '28px 20px 120px',
        minHeight: '100dvh',
      }}>

        {/* Back button */}
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: '36px', height: '36px', borderRadius: '50%',
            backgroundColor: T.surface, border: `1px solid ${T.border}`,
            color: T.textMuted, fontSize: '17px',
            marginBottom: '24px',
          }}
        >
          ‹
        </button>

        {/* Header */}
        <p style={{ fontSize: '11px', fontWeight: '600', color: T.textMuted, letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: '6px' }}>
          Workout
        </p>
        <h2 style={{ fontSize: '26px', fontWeight: '700', color: T.text, letterSpacing: '-0.5px', marginBottom: '10px' }}>
          {displayDate}
        </h2>

        {/* Editable workout title */}
        {editingTitle ? (
          <input
            ref={titleInputRef}
            type="text"
            value={titleInput}
            onChange={e => setTitleInput(e.target.value)}
            onBlur={saveTitle}
            onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); saveTitle() } if (e.key === 'Escape') { setEditingTitle(false); setTitleInput(title) } }}
            placeholder="e.g. Push Day"
            style={{
              background: 'transparent', border: 'none',
              borderBottom: `2px solid ${T.accent}`,
              padding: '4px 0', marginBottom: '28px',
              fontSize: '17px', fontWeight: '600', color: T.text,
              width: '100%', display: 'block',
            }}
          />
        ) : (
          <button
            onClick={startEditTitle}
            style={{
              display: 'block', textAlign: 'left',
              background: 'none', border: 'none', padding: 0,
              fontSize: '17px', fontWeight: title ? '600' : '400',
              color: title ? T.text : T.textDimmer,
              marginBottom: '28px', cursor: 'text',
            }}
          >
            {title || '+ Add workout title'}
          </button>
        )}

        {/* Exercise list */}
        {loading ? (
          <p style={{ fontSize: '13px', color: T.textMuted }}>Loading…</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {exercises.map(exercise => (
              <ExerciseCard
                key={exercise.id}
                exercise={exercise}
                date={date}
                onChanged={loadData}
              />
            ))}
          </div>
        )}
      </div>

      {/* Sticky "Add Exercise" button */}
      <div style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        padding: '16px 20px 28px',
        background: `linear-gradient(to top, ${T.bg} 70%, transparent)`,
        display: 'flex', justifyContent: 'center',
      }}>
        <button
          onClick={() => setShowSheet(true)}
          style={{
            ...gradientStyle,
            padding: '16px 48px',
            borderRadius: T.r.pill,
            fontSize: '15px',
            maxWidth: T.maxW,
            width: '100%',
            boxShadow: '0 4px 24px rgba(0, 240, 150, 0.2)',
          }}
        >
          + Add Exercise
        </button>
      </div>

      {/* Bottom sheet for adding exercises */}
      <AddExerciseSheet
        isOpen={showSheet}
        onClose={() => setShowSheet(false)}
        onAdd={handleAddExercise}
      />
    </>
  )
}

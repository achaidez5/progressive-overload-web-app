import { useState, useEffect } from 'react'
import { updateExercise, deleteExercise, createSet, getExerciseHistory, getExerciseMax } from '../api'
import { T, cardStyle, setPillStyle } from '../theme'
import SetRow from './SetRow'

export default function ExerciseCard({ exercise, date, onChanged }) {
  const [expanded, setExpanded] = useState(true)
  const [isEditingName, setIsEditingName] = useState(false)
  const [nameValue, setNameValue] = useState(exercise.name)
  const [badge, setBadge] = useState(null)   // {label, color}
  const [prMax, setPrMax] = useState(0)       // historical max weight (excl. today)

  // Delta badge + PR threshold
  useEffect(() => {
    getExerciseHistory(exercise.name).then(history => {
      if (history.length < 2) { setBadge(null); return }
      const currentMax = history[0].max_weight
      const prevMax = history[1].max_weight
      const diff = parseFloat((currentMax - prevMax).toFixed(1))
      if (diff > 0) setBadge({ label: `↑ +${diff} lbs`, color: T.accent })
      else if (diff < 0) setBadge({ label: `↓ ${diff} lbs`, color: T.error })
      else setBadge({ label: '— same as last', color: T.textMuted })
    })

    getExerciseMax(exercise.name, date).then(d => setPrMax(d.max_weight))
  }, [exercise.name, exercise.sets, date])

  async function handleRenameSubmit(e) {
    e?.preventDefault()
    if (!nameValue.trim() || nameValue === exercise.name) {
      setIsEditingName(false); setNameValue(exercise.name); return
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
    const nextNum = exercise.sets.length + 1
    const last = exercise.sets[exercise.sets.length - 1]
    await createSet(exercise.id, nextNum, last?.reps ?? 8, last?.weight ?? 0)
    onChanged()
  }

  const setCount = exercise.sets.length
  const sorted = [...exercise.sets].sort((a, b) => a.set_number - b.set_number)

  return (
    <div style={{ ...cardStyle, overflow: 'hidden' }}>

      {/* ── Card header (always visible) ── */}
      <div
        onClick={() => !isEditingName && setExpanded(e => !e)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 16px', cursor: 'pointer',
        }}
      >
        {/* Left: name + delta badge */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {isEditingName ? (
            <form
              onSubmit={handleRenameSubmit}
              onClick={e => e.stopPropagation()}
              style={{ marginBottom: '2px' }}
            >
              <input
                autoFocus
                value={nameValue}
                onChange={e => setNameValue(e.target.value)}
                onBlur={handleRenameSubmit}
                onKeyDown={e => e.key === 'Escape' && handleRenameSubmit()}
                style={{
                  background: 'transparent', border: 'none',
                  borderBottom: `1.5px solid ${T.accent}`,
                  padding: '2px 0', fontSize: '15px', fontWeight: '700',
                  color: T.text, width: '100%',
                }}
              />
            </form>
          ) : (
            <p
              onDoubleClick={e => { e.stopPropagation(); setIsEditingName(true) }}
              style={{ fontSize: '15px', fontWeight: '700', color: T.text, marginBottom: '3px', lineHeight: 1.2 }}
            >
              {exercise.name}
            </p>
          )}
          {badge && (
            <p style={{ fontSize: '12px', fontWeight: '600', color: badge.color }}>
              {badge.label}
            </p>
          )}
        </div>

        {/* Right: set count pill + chevron */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '12px', flexShrink: 0 }}>
          {setCount > 0 && (
            <span style={setPillStyle}>{setCount} set{setCount !== 1 ? 's' : ''}</span>
          )}
          <span style={{
            color: T.textMuted, fontSize: '14px', fontWeight: '600',
            transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease', display: 'inline-block',
          }}>
            ›
          </span>
        </div>
      </div>

      {/* ── Expandable body ── */}
      <div className={`card-body ${expanded ? 'expanded' : 'collapsed'}`}>
        <div style={{ padding: '0 16px 16px' }}>

          {/* Column headers */}
          {setCount > 0 && (
            <div style={{
              display: 'grid', gridTemplateColumns: '28px 1fr 1fr 40px',
              padding: '0 4px', marginBottom: '4px',
              fontSize: '10px', fontWeight: '700', color: T.textDimmer,
              letterSpacing: '0.8px', textTransform: 'uppercase',
            }}>
              <span>#</span>
              <span>Reps</span>
              <span>Weight</span>
              <span />
            </div>
          )}

          {/* Set rows */}
          <div style={{ marginBottom: setCount > 0 ? '12px' : 0 }}>
            {sorted.map(set => (
              <SetRow
                key={`${set.id}-${set.reps}-${set.weight}`}
                set={set}
                prMax={prMax}
                onChanged={onChanged}
              />
            ))}
          </div>

          {/* Add Set */}
          <button
            onClick={e => { e.stopPropagation(); handleAddSet() }}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '100%', padding: '10px',
              border: `1px dashed rgba(0, 240, 150, 0.3)`,
              borderRadius: T.r.input,
              background: 'rgba(0, 240, 150, 0.04)',
              fontSize: '13px', fontWeight: '600', color: T.accent,
              gap: '5px',
            }}
          >
            + Add Set
          </button>

          {/* Delete exercise (subtle, bottom of card) */}
          <button
            onClick={e => { e.stopPropagation(); handleDelete() }}
            style={{
              display: 'block', width: '100%', textAlign: 'center',
              marginTop: '12px', fontSize: '12px', color: T.textDimmer,
              background: 'none', border: 'none', padding: '4px',
              transition: 'color 0.15s',
            }}
            onMouseEnter={e => e.currentTarget.style.color = T.error}
            onMouseLeave={e => e.currentTarget.style.color = T.textDimmer}
          >
            Delete exercise
          </button>
        </div>
      </div>
    </div>
  )
}

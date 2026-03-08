import { useState } from 'react'
import { updateSet, deleteSet } from '../api'
import { T, prBadgeStyle } from '../theme'

export default function SetRow({ set, prMax, onChanged }) {
  const [editing, setEditing] = useState(false)
  const [reps, setReps] = useState(set.reps)
  const [weight, setWeight] = useState(set.weight)

  const isPR = prMax > 0 && set.weight > prMax

  async function handleConfirm() {
    setEditing(false)
    const newReps = Number(reps)
    const newWeight = Number(weight)
    if (newReps !== set.reps || newWeight !== set.weight) {
      await updateSet(set.id, newReps, newWeight)
      onChanged()
    }
  }

  async function handleDelete() {
    await deleteSet(set.id)
    onChanged()
  }

  if (editing) {
    return (
      <div style={{
        display: 'grid', gridTemplateColumns: '28px 1fr 1fr 40px',
        alignItems: 'center', padding: '7px 4px',
        borderRadius: T.r.input,
        backgroundColor: 'rgba(0, 240, 150, 0.04)',
        border: `1px solid rgba(0, 240, 150, 0.15)`,
        marginBottom: '4px',
      }}>
        {/* Set # */}
        <span style={{ fontSize: '13px', color: T.textMuted, fontWeight: '600' }}>
          {set.set_number}
        </span>

        {/* Reps input */}
        <input
          autoFocus
          type="number"
          value={reps}
          onChange={e => setReps(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleConfirm()}
          style={{
            background: 'transparent', border: 'none',
            borderBottom: `1.5px solid ${T.accent}`,
            fontSize: '14px', fontWeight: '500', color: T.text,
            width: '48px', padding: '2px 0',
          }}
        />

        {/* Weight input */}
        <input
          type="number"
          step="0.5"
          value={weight}
          onChange={e => setWeight(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleConfirm()}
          style={{
            background: 'transparent', border: 'none',
            borderBottom: `1.5px solid ${T.accent}`,
            fontSize: '14px', fontWeight: '500', color: T.text,
            width: '56px', padding: '2px 0',
          }}
        />

        {/* Confirm ✓ + Delete ✕ */}
        <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
          <button
            onClick={handleConfirm}
            style={{
              width: '26px', height: '26px', borderRadius: '50%',
              backgroundColor: T.accent, color: '#0f0f13',
              fontSize: '13px', fontWeight: '700',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', flexShrink: 0,
            }}
          >
            ✓
          </button>
          <button
            onClick={handleDelete}
            style={{
              width: '26px', height: '26px', borderRadius: '50%',
              backgroundColor: 'rgba(255,85,85,0.12)', color: T.error,
              fontSize: '13px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              border: 'none', flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      display: 'grid', gridTemplateColumns: '28px 1fr 1fr 40px',
      alignItems: 'center', padding: '8px 4px',
      borderRadius: T.r.input,
      marginBottom: '2px',
    }}>
      {/* Set # */}
      <span style={{ fontSize: '13px', color: T.textMuted, fontWeight: '600' }}>
        {set.set_number}
      </span>

      {/* Reps */}
      <span style={{ fontSize: '14px', color: T.text }}>{set.reps}</span>

      {/* Weight + optional PR badge */}
      <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
        <span style={{ fontSize: '14px', color: T.text }}>{set.weight} lbs</span>
        {isPR && <span style={prBadgeStyle}>PR</span>}
      </span>

      {/* Edit icon */}
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => setEditing(true)}
          style={{
            width: '28px', height: '28px', borderRadius: '50%',
            backgroundColor: T.surface, border: `1px solid ${T.border}`,
            color: T.textMuted, fontSize: '12px',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, transition: 'border-color 0.15s, color 0.15s',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = T.accent; e.currentTarget.style.color = T.accent }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = T.border; e.currentTarget.style.color = T.textMuted }}
          title="Edit set"
        >
          ✎
        </button>
      </div>
    </div>
  )
}

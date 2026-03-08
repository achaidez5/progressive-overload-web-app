import { useState, useEffect } from 'react'
import { T, gradientStyle } from '../theme'

export default function AddExerciseSheet({ isOpen, onClose, onAdd }) {
  const [name, setName] = useState('')

  // Reset input & handle Escape key
  useEffect(() => {
    if (!isOpen) { setName(''); return }
    function handleKey(e) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [isOpen, onClose])

  if (!isOpen) return null

  async function handleSubmit(e) {
    e.preventDefault()
    const trimmed = name.trim()
    if (!trimmed) return
    await onAdd(trimmed)
    onClose()
  }

  return (
    <>
      {/* Backdrop */}
      <div className="sheet-backdrop" onClick={onClose} />

      {/* Sheet */}
      <div className="sheet-panel" style={{ padding: '20px 24px 40px' }}>
        {/* Handle */}
        <div style={{
          width: '36px', height: '4px', borderRadius: '2px',
          backgroundColor: T.border, margin: '0 auto 24px',
        }} />

        <h3 style={{ fontSize: '17px', fontWeight: '700', color: T.text, marginBottom: '20px' }}>
          Add Exercise
        </h3>

        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Exercise name"
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              borderBottom: `2px solid ${T.accent}`,
              borderRadius: 0,
              padding: '8px 0',
              fontSize: '17px',
              fontWeight: '500',
              color: T.text,
              marginBottom: '28px',
              display: 'block',
            }}
          />
          <button
            type="submit"
            style={{
              ...gradientStyle,
              width: '100%',
              padding: '16px',
              fontSize: '16px',
              borderRadius: T.r.button,
              opacity: name.trim() ? 1 : 0.4,
              transition: 'opacity 0.15s',
            }}
          >
            Add Exercise
          </button>
        </form>
      </div>
    </>
  )
}

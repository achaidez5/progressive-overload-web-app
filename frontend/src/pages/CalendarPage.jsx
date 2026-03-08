import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCalendarMonth, getStreak, getRecentDays } from '../api'
import { T, streakPillStyle, cardStyle } from '../theme'

const MONTHS = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
]
const DAY_LABELS = ['S','M','T','W','T','F','S']

function pad(n) { return String(n).padStart(2, '0') }

function formatRecentDate(dateStr) {
  return new Date(dateStr + 'T00:00:00').toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  })
}

export default function CalendarPage() {
  const navigate = useNavigate()
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [workoutDates, setWorkoutDates] = useState(new Set())
  const [streak, setStreak] = useState(0)
  const [recentDays, setRecentDays] = useState([])

  useEffect(() => {
    getStreak().then(d => setStreak(d.streak))
    getRecentDays(3).then(setRecentDays)
  }, [])

  useEffect(() => {
    getCalendarMonth(year, month + 1).then(days => {
      setWorkoutDates(new Set(days.map(d => d.date)))
    })
  }, [year, month])

  function prevMonth() {
    if (month === 0) { setYear(y => y - 1); setMonth(11) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setYear(y => y + 1); setMonth(0) }
    else setMonth(m => m + 1)
  }

  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]
  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`

  return (
    <div style={{ maxWidth: T.maxW, margin: '0 auto', padding: '32px 20px 80px', minHeight: '100dvh' }}>

      {/* App label */}
      <p style={{
        fontSize: '11px', fontWeight: '600', color: T.textDimmer,
        letterSpacing: '1.2px', textTransform: 'uppercase', marginBottom: '32px',
      }}>
        Progressive Overload
      </p>

      {/* Month header + chevrons */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: '700', color: T.text, letterSpacing: '-0.4px' }}>
          {MONTHS[month]} {year}
        </h2>
        <div style={{ display: 'flex', gap: '6px' }}>
          {[['‹', prevMonth], ['›', nextMonth]].map(([ch, fn]) => (
            <button
              key={ch}
              onClick={fn}
              style={{
                width: '34px', height: '34px', borderRadius: '50%',
                backgroundColor: T.surface, border: `1px solid ${T.border}`,
                color: T.textMuted, fontSize: '17px',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              {ch}
            </button>
          ))}
        </div>
      </div>

      {/* Streak pill */}
      {streak > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <span style={streakPillStyle}>
            <span style={{
              width: '7px', height: '7px', borderRadius: '50%',
              backgroundColor: T.accent, boxShadow: `0 0 8px ${T.accent}`, flexShrink: 0,
            }} />
            {streak}-day streak active
          </span>
        </div>
      )}

      {/* Day-of-week labels */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '4px' }}>
        {DAY_LABELS.map((d, i) => (
          <div key={i} style={{
            textAlign: 'center', fontSize: '11px', fontWeight: '600',
            color: T.textDimmer, padding: '4px 0', letterSpacing: '0.3px',
          }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid — circle cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px', marginBottom: '36px' }}>
        {cells.map((day, i) => {
          if (day === null) return <div key={`e-${i}`} />
          const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`
          const isToday = dateStr === todayStr
          const hasWorkout = workoutDates.has(dateStr)

          return (
            <button
              key={dateStr}
              onClick={() => navigate(`/day/${dateStr}`)}
              style={{
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                aspectRatio: '1', borderRadius: '50%',
                background: isToday ? T.gradient : 'transparent',
                color: isToday ? '#0f0f13' : T.text,
                fontSize: '14px', fontWeight: isToday ? '700' : '400',
                border: 'none', gap: '2px',
              }}
            >
              <span style={{ lineHeight: 1 }}>{day}</span>
              {hasWorkout && (
                <span style={{
                  width: '4px', height: '4px', borderRadius: '50%',
                  backgroundColor: isToday ? 'rgba(15,15,19,0.55)' : T.accent,
                  flexShrink: 0,
                }} />
              )}
            </button>
          )
        })}
      </div>

      {/* Recent Workouts section */}
      {recentDays.length > 0 && (
        <div>
          <p style={{
            fontSize: '11px', fontWeight: '600', color: T.textDimmer,
            letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '12px',
          }}>
            Recent
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recentDays.map(day => (
              <button
                key={day.date}
                onClick={() => navigate(`/day/${day.date}`)}
                style={{
                  ...cardStyle,
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '14px 16px', width: '100%', textAlign: 'left',
                  transition: 'opacity 0.15s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <div>
                  <p style={{ fontSize: '14px', fontWeight: '600', color: T.text, marginBottom: '3px' }}>
                    {day.title || 'Workout'}
                  </p>
                  <p style={{ fontSize: '12px', color: T.textMuted }}>
                    {formatRecentDate(day.date)}
                    {' · '}
                    {day.exercise_count} exercise{day.exercise_count !== 1 ? 's' : ''}
                  </p>
                </div>
                <span style={{ color: T.textMuted, fontSize: '18px', marginLeft: '8px' }}>›</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

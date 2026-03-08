import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getCalendarMonth } from '../api'

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function pad(n) {
  return String(n).padStart(2, '0')
}

export default function CalendarPage() {
  const navigate = useNavigate()
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth()) // 0-indexed
  const [workoutDates, setWorkoutDates] = useState(new Set())

  useEffect(() => {
    getCalendarMonth(year, month + 1).then((days) => {
      setWorkoutDates(new Set(days.map((d) => d.date)))
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

  function handleDayClick(day) {
    const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`
    navigate(`/day/${dateStr}`)
  }

  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells = [
    ...Array(firstDayOfWeek).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const todayStr = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}`

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      {/* Header */}
      <h1 className="text-2xl font-bold text-center mb-6" style={{ color: '#00FF87' }}>
        Progressive Overload
      </h1>

      {/* Month navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={prevMonth}
          className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-opacity hover:opacity-70"
          style={{ backgroundColor: '#1a1a1a', color: '#00FF87' }}
        >
          ‹
        </button>
        <span className="text-lg font-semibold">
          {MONTH_NAMES[month]} {year}
        </span>
        <button
          onClick={nextMonth}
          className="w-10 h-10 rounded-full flex items-center justify-center text-xl font-bold transition-opacity hover:opacity-70"
          style={{ backgroundColor: '#1a1a1a', color: '#00FF87' }}
        >
          ›
        </button>
      </div>

      {/* Day-of-week labels */}
      <div className="grid grid-cols-7 mb-2">
        {DAY_LABELS.map((d) => (
          <div key={d} className="text-center text-xs font-medium py-1" style={{ color: '#555' }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />
          const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`
          const isToday = dateStr === todayStr
          const hasWorkout = workoutDates.has(dateStr)

          return (
            <button
              key={dateStr}
              onClick={() => handleDayClick(day)}
              className="flex flex-col items-center justify-center rounded-xl py-2 transition-all hover:opacity-80 active:scale-95"
              style={{
                backgroundColor: isToday ? '#00FF87' : '#1a1a1a',
                color: isToday ? '#0a0a0a' : '#f5f5f5',
                minHeight: '52px',
              }}
            >
              <span className="text-sm font-medium">{day}</span>
              {hasWorkout && (
                <span
                  className="w-1.5 h-1.5 rounded-full mt-0.5"
                  style={{ backgroundColor: isToday ? '#0a0a0a' : '#00FF87' }}
                />
              )}
            </button>
          )
        })}
      </div>

      {/* Today shortcut */}
      <div className="mt-8 text-center">
        <button
          onClick={() => navigate(`/day/${todayStr}`)}
          className="px-8 py-3 rounded-full text-sm font-bold transition-opacity hover:opacity-80"
          style={{ backgroundColor: '#00FF87', color: '#0a0a0a' }}
        >
          Log Today
        </button>
      </div>
    </div>
  )
}

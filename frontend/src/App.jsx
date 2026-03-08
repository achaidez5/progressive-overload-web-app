import { Routes, Route, Navigate } from 'react-router-dom'
import CalendarPage from './pages/CalendarPage'
import DayPage from './pages/DayPage'

function App() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0a0a0a', color: '#f5f5f5' }}>
      <Routes>
        <Route path="/" element={<CalendarPage />} />
        <Route path="/day/:date" element={<DayPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
